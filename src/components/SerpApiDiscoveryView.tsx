import React, { useMemo, useState } from 'react';
import {
  Search,
  ExternalLink,
  ShieldAlert,
  FileUp,
  CheckCircle2,
} from 'lucide-react';
import { SERP_API_DISCOVERY_FIXTURE } from '../data/serpApiDiscoveryFixtures';
import {
  buildTenderDiscoveryQuery,
  toTenderDiscoveryResponse,
  TenderDiscoveryResponse,
} from '../utils/serpApiDiscovery';

interface SerpApiDiscoveryViewProps {
  onOpenNewTender: () => void;
}

export const SerpApiDiscoveryView: React.FC<SerpApiDiscoveryViewProps> = ({ onOpenNewTender }) => {
  const [intent, setIntent] = useState('government tender high performance computing');
  const [portalDomain, setPortalDomain] = useState('');
  const [response, setResponse] = useState<TenderDiscoveryResponse | null>(null);
  const [liveAttempted, setLiveAttempted] = useState(false);
  const query = useMemo(() => buildTenderDiscoveryQuery(intent, portalDomain), [intent, portalDomain]);

  const runMockDiscovery = () => {
    setLiveAttempted(false);
    setResponse(toTenderDiscoveryResponse(query, SERP_API_DISCOVERY_FIXTURE, 'MOCK'));
  };

  const runLiveDiscovery = async () => {
    setLiveAttempted(false);
    try {
      const res = await fetch('/api/serpapi/discover-tenders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, num: 10 }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLiveAttempted(true);
        setResponse(null);
        return;
      }

      setResponse(data);
    } catch {
      setLiveAttempted(true);
      setResponse(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold font-mono uppercase">
              Search Discovery
            </div>
            <h1 className="mt-2 text-2xl font-bold text-stone-900">Find Live Tender Leads</h1>
            <p className="mt-1 text-sm text-stone-600 max-w-3xl">
              SerpApi supplies discovery leads. TenderDelta does not treat snippets as authoritative evidence:
              source documents still have to pass the deterministic evidence pipeline.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-stone-500">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>FAIL-CLOSED EVIDENCE BOUNDARY</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_220px_auto] gap-3">
          <label className="block">
            <span className="block text-[10px] uppercase font-bold font-mono text-stone-500 mb-1">
              Discovery intent
            </span>
            <input
              value={intent}
              onChange={(event) => setIntent(event.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g. government tender GPU cluster corrigendum"
            />
          </label>
          <label className="block">
            <span className="block text-[10px] uppercase font-bold font-mono text-stone-500 mb-1">
              Optional site
            </span>
            <input
              value={portalDomain}
              onChange={(event) => setPortalDomain(event.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="gem.gov.in"
            />
          </label>
          <div className="flex items-end gap-2">
            <button
              onClick={runMockDiscovery}
              className="px-4 py-2 rounded bg-stone-900 text-white text-xs font-semibold font-mono hover:bg-stone-800"
            >
              <span className="inline-flex items-center gap-2">
                <Search className="w-3.5 h-3.5" />
                Run Fixture
              </span>
            </button>
            <button
              onClick={runLiveDiscovery}
              className="px-4 py-2 rounded border border-blue-300 text-blue-800 bg-blue-50 text-xs font-semibold font-mono hover:bg-blue-100"
            >
              Live API
            </button>
          </div>
        </div>

        <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <strong>Evidence rule:</strong> a search result can identify a candidate source, but it cannot itself
          establish what a tender says.
        </div>
      </div>

      {liveAttempted && (
        <div className="bg-white border border-blue-200 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-blue-700 mt-0.5" />
            <div>
              <h2 className="font-bold text-stone-900">Live SerpApi access is unavailable</h2>
              <p className="mt-1 text-sm text-stone-600">
                Configure <code className="font-mono">SERPAPI_API_KEY</code> privately. The application never
                stores the key in source and does not ask for it in the UI.
              </p>
            </div>
          </div>
        </div>
      )}

      {response && (
        <div className="space-y-4">
          <div className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="text-xs font-mono text-stone-600">
              Query: <span className="text-stone-900 font-semibold">{response.query}</span>
            </div>
            <div className="text-[10px] font-mono uppercase text-stone-500">
              Mode: {response.searchedWith} • Provenance: {response.provenance}
            </div>
          </div>

          {response.results.map((result) => (
            <div key={result.id} className="bg-white border border-stone-200 rounded-lg p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">{result.title}</h3>
                      <div className="text-[10px] font-mono text-stone-500 mt-0.5">{result.sourceDomain}</div>
                    </div>
                    {result.position !== null && (
                      <span className="text-[10px] font-mono text-stone-400">#{result.position}</span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                    {result.snippet || 'No snippet returned.'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-stone-300 text-stone-700 text-xs font-medium hover:bg-stone-50"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Inspect Source
                    </a>
                    <button
                      onClick={onOpenNewTender}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                    >
                      <FileUp className="w-3.5 h-3.5" />
                      Ingest Source Document
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!response && !liveAttempted && (
        <div className="bg-stone-50 border border-dashed border-stone-300 rounded-lg p-10 text-center text-sm text-stone-500">
          Run the deterministic fixture first, then repeat the same query set against live SerpApi after the
          private API-access gate is satisfied.
        </div>
      )}
    </div>
  );
};
