// SerpApi hackathon gate: discovery remains explicitly non-authoritative.
export interface SerpApiOrganicResult {
  position?: number;
  title?: string;
  link?: string;
  snippet?: string;
  displayed_link?: string;
}

export interface TenderDiscoveryResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  sourceDomain: string;
  position: number | null;
  provenance: 'SEARCH_DISCOVERY';
  authoritative: false;
}

export interface TenderDiscoveryResponse {
  query: string;
  results: TenderDiscoveryResult[];
  searchedWith: 'SERPAPI' | 'MOCK';
  provenance: 'SEARCH_DISCOVERY';
  authoritative: false;
  warning: string;
}

export function parseSerpApiDiscoveryResponse(
  payload: { organic_results?: SerpApiOrganicResult[] },
  searchedWith: 'SERPAPI' | 'MOCK' = 'MOCK'
): TenderDiscoveryResponse {
  const rawResults = Array.isArray(payload?.organic_results) ? payload.organic_results : [];

  const seen = new Set<string>();
  const results = rawResults
    .filter((item) => {
      if (typeof item?.link !== 'string') return false;
      try {
        const parsed = new URL(item.link);
        if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password) return false;
        if (seen.has(parsed.href)) return false;
        seen.add(parsed.href);
        return true;
      } catch {
        return false;
      }
    })
    .map((item, index) => {
      const url = item.link as string;
      let sourceDomain = 'unknown';
      try {
        sourceDomain = new URL(url).hostname.replace(/^www\./i, '');
      } catch {
        // Keep the deterministic fallback domain.
      }

      return {
        id: ['search-', String(index + 1)].join(''),
        title: String(item.title || 'Untitled search result').trim(),
        url,
        snippet: String(item.snippet || '').trim(),
        sourceDomain,
        position: Number.isFinite(item.position) ? Number(item.position) : null,
        provenance: 'SEARCH_DISCOVERY' as const,
        authoritative: false as const,
      };
    });

  return {
    query: '',
    results,
    searchedWith,
    provenance: 'SEARCH_DISCOVERY',
    authoritative: false,
    warning:
      'Search results are discovery leads only. They are untrusted and must not be treated as authoritative tender evidence until source documents are ingested and deterministically verified.',
  };
}

export function buildTenderDiscoveryQuery(intent: string, portalDomain?: string): string {
  const cleanedIntent = intent.trim().replace(/\s+/g, ' ');
  if (!portalDomain?.trim()) return cleanedIntent;
  const domain = portalDomain.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  return [cleanedIntent, ['site:', domain].join('')].join(' ');
}

export function toTenderDiscoveryResponse(
  query: string,
  payload: { organic_results?: SerpApiOrganicResult[] },
  searchedWith: 'SERPAPI' | 'MOCK'
): TenderDiscoveryResponse {
  const parsed = parseSerpApiDiscoveryResponse(payload, searchedWith);
  return { ...parsed, query };
}
