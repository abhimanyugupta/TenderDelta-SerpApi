import { SERP_API_DISCOVERY_TEST_CASES } from '../src/data/serpApiDiscoveryFixtures';
import { buildTenderDiscoveryQuery, toTenderDiscoveryResponse } from '../src/utils/serpApiDiscovery';

interface BenchmarkRow {
  name: string;
  query: string;
  ok: boolean;
  organicResults: number;
  httpStatus: number;
  officialDomainCandidate: boolean;
  error?: string;
}

function assertSecret(value: string | undefined): asserts value is string {
  if (!value) throw new Error('SERPAPI_API_KEY is not configured.');
}

function looksOfficial(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host.endsWith('.gov.in') ||
      host.includes('.nic.in') ||
      host.includes('eprocure') ||
      host === 'gem.gov.in'
    );
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const apiKey = process.env.SERPAPI_API_KEY;
  assertSecret(apiKey);

  const rows: BenchmarkRow[] = [];

  for (const testCase of SERP_API_DISCOVERY_TEST_CASES) {
    const query = buildTenderDiscoveryQuery(testCase.intent, testCase.portalDomain);

    try {
      const params = new URLSearchParams({
        engine: 'google',
        q: query,
        api_key: apiKey,
        num: '10',
        hl: 'en',
        gl: 'in',
      });
      const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
      const data = await response.json();
      const parsed = toTenderDiscoveryResponse(query, data, 'SERPAPI');
      const organicResults = parsed.results.length;
      const officialDomainCandidate = parsed.results.some((result) => looksOfficial(result.url));

      rows.push({
        name: testCase.name,
        query,
        ok: response.ok && !data?.error,
        organicResults,
        httpStatus: response.status,
        officialDomainCandidate,
        error: data?.error ? 'Provider returned an error.' : undefined,
      });
    } catch (error: any) {
      rows.push({
        name: testCase.name,
        query,
        ok: false,
        organicResults: 0,
        httpStatus: 0,
        officialDomainCandidate: false,
        error: 'Request failed; sensitive provider details omitted.',
      });
    }
  }

  const successful = rows.filter((row) => row.ok);
  const usable = rows.filter((row) => row.ok && row.organicResults > 0);
  const official = rows.filter((row) => row.ok && row.officialDomainCandidate);

  const report = {
    generatedAt: new Date().toISOString(),
    totalCases: rows.length,
    successfulCases: successful.length,
    usableCases: usable.length,
    officialDomainCandidateCases: official.length,
    acceptanceGate: {
      allRequestsSuccessful: successful.length === rows.length,
      atLeastEightUsableCases: usable.length >= 8,
      atLeastFiveOfficialDomainCandidateCases: official.length >= 5,
    },
    passed:
      successful.length === rows.length &&
      usable.length >= 8 &&
      official.length >= 5,
    rows,
    provenanceInvariant:
      'All parsed results remain SEARCH_DISCOVERY and authoritative=false. Search results are never promoted to tender evidence.',
  };

  console.log(JSON.stringify(report, null, 2));

  if (!report.passed) process.exit(1);
}

main().catch((error) => {
  console.error('Live benchmark failed. Check private runtime configuration.');
  process.exit(1);
});
