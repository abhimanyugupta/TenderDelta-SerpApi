import {
  buildTenderDiscoveryQuery,
  parseSerpApiDiscoveryResponse,
  toTenderDiscoveryResponse,
} from './serpApiDiscovery';
import {
  SERP_API_DISCOVERY_FIXTURE,
  SERP_API_DISCOVERY_TEST_CASES,
} from '../data/serpApiDiscoveryFixtures';

function assert(condition: unknown, message: string): void {
  if (!condition) throw new Error(message);
}

const fixtureResult = parseSerpApiDiscoveryResponse(SERP_API_DISCOVERY_FIXTURE, 'MOCK');

assert(fixtureResult.results.length === 3, 'Expected three parsed fixture results.');
assert(
  fixtureResult.results.every((result) => result.authoritative === false),
  'Search results must never be authoritative.'
);
assert(
  fixtureResult.results.every((result) => result.provenance === 'SEARCH_DISCOVERY'),
  'Every result must retain SEARCH_DISCOVERY provenance.'
);
assert(
  fixtureResult.results[0].sourceDomain === 'example.gov.in',
  'Expected deterministic domain extraction from result URL.'
);

for (const testCase of SERP_API_DISCOVERY_TEST_CASES) {
  const query = buildTenderDiscoveryQuery(testCase.intent, testCase.portalDomain);
  assert(query.length > 0, `Query was empty for case: ${testCase.name}`);
}

assert(
  buildTenderDiscoveryQuery('  tender   corrigendum ', 'https://www.gov.in') ===
    'tender corrigendum site:gov.in',
  'Query normalization or site scoping failed.'
);

const response = toTenderDiscoveryResponse(
  'government tender high performance computing',
  SERP_API_DISCOVERY_FIXTURE,
  'MOCK'
);

assert(response.query === 'government tender high performance computing', 'Query should be preserved.');
assert(response.authoritative === false, 'Discovery response must never be authoritative.');
assert(
  response.warning.includes('discovery leads only'),
  'Discovery warning should explain the evidence boundary.'
);

console.log(
  `SerpApi discovery tests passed: ${SERP_API_DISCOVERY_TEST_CASES.length + 6} assertions.`
);
