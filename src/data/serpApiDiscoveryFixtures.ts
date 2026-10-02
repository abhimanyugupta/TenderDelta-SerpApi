export const SERP_API_DISCOVERY_FIXTURE = {
  organic_results: [
    {
      position: 1,
      title: 'Tender Notice — Advanced Computing Infrastructure',
      link: 'https://example.gov.in/tenders/advanced-computing',
      snippet: 'Notice inviting tender for high-performance computing infrastructure.',
      displayed_link: 'example.gov.in',
    },
    {
      position: 2,
      title: 'Corrigendum No. 2 — Advanced Computing Infrastructure',
      link: 'https://example.gov.in/tenders/corrigendum-2',
      snippet: 'Deadline and eligibility amendments to the tender notice.',
      displayed_link: 'example.gov.in',
    },
    {
      position: 3,
      title: 'Commercial Bid Document',
      link: 'https://procurement.example.org/boq/revised-boq.xlsx',
      snippet: 'Revised bill of quantities and pricing schedule.',
      displayed_link: 'procurement.example.org',
    },
  ],
};

export const SERP_API_DISCOVERY_TEST_CASES = [
  { name: 'generic tender notice', intent: 'government tender high performance computing' },
  { name: 'corrigendum', intent: 'tender corrigendum deadline extension' },
  { name: 'BOQ', intent: 'tender revised bill of quantities BOQ' },
  { name: 'organization-specific', intent: 'tender AI computing infrastructure', portalDomain: 'gem.gov.in' },
  { name: 'deadline amendment', intent: 'tender bid submission deadline amendment' },
  { name: 'pre-bid clarification', intent: 'tender pre bid clarification reply matrix' },
  { name: 'technical specification', intent: 'tender technical specification GPU cluster' },
  { name: 'local procurement', intent: 'Uttar Pradesh government tender AI infrastructure' },
  { name: 'public-sector organization', intent: 'PSU tender data center infrastructure' },
  { name: 'document discovery', intent: 'site:gov.in tender corrigendum PDF GPU' },
];
