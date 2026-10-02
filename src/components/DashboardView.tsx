import React from 'react';
import { 
  AlertOctagon, 
  Clock, 
  FileDiff, 
  ShieldAlert, 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  AlertTriangle,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { Tender, UserRoleView } from '../types';

interface DashboardViewProps {
  tenders: Tender[];
  activeTender: Tender | null;
  onSelectTender: (tender: Tender) => void;
  onOpenNewTender: () => void;
  onNavigateToTab: (tab: string) => void;
  activeRole: UserRoleView;
  onOpenCitationModal: (docName: string, page: number, snippet: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tenders,
  activeTender,
  onSelectTender,
  onOpenNewTender,
  onNavigateToTab,
  activeRole,
  onOpenCitationModal
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredTenders = tenders.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Aggregated portfolio metrics
  const totalActiveTenders = tenders.length;
  const criticalTendersCount = tenders.filter(t => t.riskScore === 'CRITICAL' || t.riskScore === 'HIGH').length;
  const totalChangesAcrossAll = tenders.reduce((acc, t) => acc + t.changes.length, 0);
  const totalOpenTasks = tenders.reduce((acc, t) => acc + t.tasks.filter(tk => tk.status === 'OPEN' || tk.status === 'IN_PROGRESS').length, 0);
  const totalConflicts = tenders.reduce((acc, t) => acc + t.conflicts.filter(c => c.status === 'OPEN').length, 0);

  // Formatter for INR Currency
  const formatInr = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(2)} Lakhs`;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner / Callout */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-blue-50 text-blue-800 border border-blue-200">
              AUDIT TRAIL ACTIVE
            </span>
            <span className="text-xs text-stone-500 font-mono">GFR 2017 & CVC Compliance Guard</span>
          </div>
          <h1 className="text-xl font-bold text-stone-900 mt-1 font-sans tracking-tight">
            Procurement Change Intelligence Portfolio
          </h1>
          <p className="text-xs text-stone-600 max-w-2xl mt-0.5">
            Real-time multi-version diffing across Original NITs, Corrigenda, Pre-bid clarifications, and Revised BOQs for Indian Government & PSU Tenders.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 flex-shrink-0">
          <button
            id="dashboard-new-tender-btn"
            onClick={onOpenNewTender}
            className="flex items-center space-x-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Analyze New Tender</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        
        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 font-mono">ACTIVE TENDERS</span>
            <Building2 className="w-4 h-4 text-stone-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-stone-900 font-mono tabular-nums">{totalActiveTenders}</span>
            <span className="text-[11px] text-stone-500 font-mono">Tracked</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Under continuous corrigenda watch</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 font-mono">AT RISK / CRITICAL</span>
            <AlertOctagon className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-red-600 font-mono tabular-nums">{criticalTendersCount}</span>
            <span className="text-[11px] text-red-600 font-semibold font-mono">Immediate Action</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Substantive turnover / criteria shifts</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 font-mono">MATERIAL CHANGES</span>
            <FileDiff className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-stone-900 font-mono tabular-nums">{totalChangesAcrossAll}</span>
            <span className="text-[11px] text-blue-600 font-mono font-semibold">Grounded</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Across 7 uploaded version dockets</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 font-mono">PENDING ACTIONS</span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-amber-600 font-mono tabular-nums">{totalOpenTasks}</span>
            <span className="text-[11px] text-amber-700 font-mono">Open Tasks</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Requires human bid sign-off</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 font-mono">UNRESOLVED CONFLICTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-stone-900 font-mono tabular-nums">{totalConflicts}</span>
            <span className="text-[11px] text-stone-500 font-mono">Clauses</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Contradictory Annexure terms</p>
        </div>

      </div>

      {/* Main Grid: Active Tenders & Side Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Active Tenders List */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-stone-900 uppercase font-mono tracking-wider">
                Active Tender Engagements ({filteredTenders.length})
              </h2>
            </div>
            
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by tender, ID or org..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-3.5">
            {filteredTenders.map((tender) => {
              const isSelected = activeTender?.id === tender.id;
              const criticalChanges = tender.changes.filter(c => c.materiality === 'CRITICAL').length;
              const highChanges = tender.changes.filter(c => c.materiality === 'HIGH').length;
              const openTasks = tender.tasks.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;

              return (
                <div
                  key={tender.id}
                  id={`tender-card-${tender.id}`}
                  className={`bg-white border rounded-lg p-5 transition-all shadow-xs ${
                    isSelected 
                      ? 'border-blue-500 ring-1 ring-blue-500/20' 
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-stone-100 text-stone-700 border border-stone-200">
                          {tender.portal}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold font-mono bg-blue-50 text-blue-700 border border-blue-200">
                          {tender.currentVersion}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                          tender.riskScore === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-200' :
                          tender.riskScore === 'HIGH' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          Risk: {tender.riskScore}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-stone-900 leading-snug">
                        {tender.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-stone-600 font-mono">
                        <span>Org: <strong className="text-stone-800">{tender.organization}</strong></span>
                        <span>Ref: <strong className="text-stone-800">{tender.referenceNumber}</strong></span>
                        <span>Value: <strong className="text-stone-800">{formatInr(tender.estimatedValueInr)}</strong></span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-[11px] font-mono text-stone-500 uppercase">Submission Due</div>
                      <div className="text-sm font-bold text-stone-900 font-mono mt-0.5">
                        {new Date(tender.currentSubmissionDeadline).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded inline-block mt-0.5 font-mono">
                        +7 Days Extended
                      </div>
                    </div>
                  </div>

                  {/* Material Changes & Risk Summary */}
                  {tender.changes.length > 0 && (
                    <div className="mt-4 pt-3.5 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      <div className="bg-stone-50 p-2 rounded border border-stone-100">
                        <span className="text-[10px] text-stone-500 block">TOTAL CHANGES</span>
                        <span className="font-bold text-stone-900 text-sm">{tender.changes.length} Detected</span>
                      </div>
                      <div className="bg-red-50/60 p-2 rounded border border-red-100">
                        <span className="text-[10px] text-red-600 block">CRITICAL CHANGES</span>
                        <span className="font-bold text-red-700 text-sm">{criticalChanges} Clauses</span>
                      </div>
                      <div className="bg-amber-50/60 p-2 rounded border border-amber-100">
                        <span className="text-[10px] text-amber-700 block">HIGH MATERIALITY</span>
                        <span className="font-bold text-amber-800 text-sm">{highChanges} Clauses</span>
                      </div>
                      <div className="bg-stone-50 p-2 rounded border border-stone-100">
                        <span className="text-[10px] text-stone-500 block">PENDING ACTIONS</span>
                        <span className="font-bold text-stone-900 text-sm">{openTasks} Required</span>
                      </div>
                    </div>
                  )}

                  {/* Card Footer Actions */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="text-xs text-stone-500 flex items-center space-x-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>5 Document Versions Ingested & Verified</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        id={`open-workbench-btn-${tender.id}`}
                        onClick={() => {
                          onSelectTender(tender);
                          onNavigateToTab('changes');
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors"
                      >
                        <span>Open Intelligence Workbench</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Column: Critical Changes Stream & Imminent Deadlines */}
        <div className="space-y-5">
          
          {/* Active Tender Highlights */}
          {activeTender && (
            <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <h3 className="text-xs font-bold text-stone-900 uppercase font-mono tracking-wider">
                    Critical Change Signals
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-stone-500">Active Tender</span>
              </div>

              <div className="space-y-2.5">
                {activeTender.changes.length === 0 ? (
                  <div className="p-3.5 text-center rounded bg-stone-50 border border-stone-200 text-xs space-y-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                    <p className="font-bold text-stone-800">0 Material Changes Detected</p>
                    <p className="text-[11px] text-stone-500">The uploaded tender documents contain no corrigenda or threshold modifications.</p>
                  </div>
                ) : (
                  activeTender.changes
                    .filter(c => c.materiality === 'CRITICAL' || c.materiality === 'HIGH')
                    .slice(0, 3)
                    .map((change) => (
                      <div 
                        key={change.id}
                        className="p-2.5 rounded bg-stone-50 border border-stone-200/80 hover:border-stone-300 transition-colors text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold font-mono ${
                            change.materiality === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {change.materiality}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">{change.category}</span>
                        </div>

                        <p className="font-semibold text-stone-900 leading-snug">{change.title}</p>
                        
                        <div className="mt-1.5 flex items-center justify-between text-[11px] text-stone-600">
                          <span className="font-mono text-stone-500 truncate max-w-[160px]">
                            {change.sourceCitation.documentName} (p.{change.sourceCitation.pageNumber})
                          </span>
                          <button
                            onClick={() => onOpenCitationModal(
                              change.sourceCitation.documentName,
                              change.sourceCitation.pageNumber,
                              change.sourceCitation.exactSnippet
                            )}
                            className="text-blue-600 hover:text-blue-800 font-medium font-mono text-[10px] flex items-center"
                          >
                            <span>View Source</span>
                            <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>

              <button
                onClick={() => onNavigateToTab('changes')}
                className="w-full text-center py-2 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold font-mono transition-colors block"
              >
                View All {activeTender.changes.length} Changes →
              </button>
            </div>
          )}

          {/* Deadlines Timeline Widget */}
          {activeTender && (
            <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold text-stone-900 uppercase font-mono tracking-wider">
                    Milestone Calendar
                  </h3>
                </div>
                <span className="text-[10px] text-amber-700 bg-amber-50 font-mono px-1.5 py-0.5 rounded font-bold border border-amber-200">
                  +7D Shift
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {activeTender.deadlines.map((dl) => (
                  <div key={dl.id} className="flex items-start justify-between border-l-2 border-stone-200 pl-3 py-0.5">
                    <div>
                      <p className="font-semibold text-stone-800">{dl.milestone}</p>
                      <p className="text-[11px] text-stone-500 font-mono mt-0.5">{dl.currentDate}</p>
                    </div>
                    {dl.isExtended && (
                      <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        EXTENDED
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigateToTab('timeline')}
                className="w-full text-center py-2 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold font-mono transition-colors block"
              >
                Inspect Corrigendum History →
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
