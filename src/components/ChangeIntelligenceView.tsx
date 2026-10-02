import React, { useState } from 'react';
import { 
  FileDiff, 
  Filter, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Flag, 
  PlusCircle, 
  AlertOctagon, 
  ArrowRight,
  Maximize2,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Info,
  Calendar
} from 'lucide-react';
import { Tender, MaterialChange, MaterialityLevel, UserRoleView, VerificationStatus } from '../types';

interface ChangeIntelligenceViewProps {
  tender: Tender;
  activeRole: UserRoleView;
  onOpenSideBySide: (change: MaterialChange) => void;
  onOpenSourceViewer: (
    docName: string, 
    page?: number | null, 
    snippet?: string,
    extractionMethod?: any,
    verificationStatus?: any,
    sectionNumber?: string | null
  ) => void;
  onConfirmChange: (id: string) => void;
  onFlagChange: (id: string, note: string) => void;
  onCreateTaskFromChange: (change: MaterialChange) => void;
}

export const ChangeIntelligenceView: React.FC<ChangeIntelligenceViewProps> = ({
  tender,
  activeRole,
  onOpenSideBySide,
  onOpenSourceViewer,
  onConfirmChange,
  onFlagChange,
  onCreateTaskFromChange
}) => {
  const [selectedMateriality, setSelectedMateriality] = useState<MaterialityLevel | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [verificationFilter, setVerificationFilter] = useState<'ALL' | 'UNREVIEWED' | 'CONFIRMED' | 'FLAGGED'>('ALL');

  // Filter changes
  const filteredChanges = tender.changes.filter(change => {
    // Role filter
    if (activeRole !== 'ALL' && !change.relevantRoles.includes(activeRole)) {
      return false;
    }
    // Materiality filter
    if (selectedMateriality !== 'ALL' && change.materiality !== selectedMateriality) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'ALL' && change.category !== selectedCategory) {
      return false;
    }
    // Verification filter
    if (verificationFilter !== 'ALL' && change.verificationStatus !== verificationFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = change.title.toLowerCase().includes(q);
      const matchOriginal = change.originalText.toLowerCase().includes(q);
      const matchUpdated = change.updatedText.toLowerCase().includes(q);
      const matchImpact = change.impactExplanation.toLowerCase().includes(q);
      const matchDoc = change.sourceCitation.documentName.toLowerCase().includes(q);
      if (!matchTitle && !matchOriginal && !matchUpdated && !matchImpact && !matchDoc) {
        return false;
      }
    }
    return true;
  });

  const categories = Array.from(new Set(tender.changes.map(c => c.category)));

  // Counts for pills
  const criticalCount = tender.changes.filter(c => c.materiality === 'CRITICAL').length;
  const highCount = tender.changes.filter(c => c.materiality === 'HIGH').length;
  const mediumCount = tender.changes.filter(c => c.materiality === 'MEDIUM').length;
  const lowCount = tender.changes.filter(c => c.materiality === 'LOW').length;
  const infoCount = tender.changes.filter(c => c.materiality === 'INFORMATIONAL').length;

  return (
    <div className="space-y-5 pb-12">
      
      {/* Header Overview Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-blue-50 text-blue-800 border border-blue-200">
                TENDER VERSION INTELLIGENCE
              </span>
              {(tender.isDemo || tender.provenance === 'SYNTHETIC_DEMO') && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-amber-100 text-amber-900 border border-amber-300">
                  DEMO BENCHMARK EVIDENCE (ISOLATED)
                </span>
              )}
              <span className="text-xs text-stone-500 font-mono">
                {tender.currentVersion} • {tender.changes.length} Total Changes
              </span>
            </div>
            <h1 className="text-xl font-bold text-stone-900 mt-1 font-sans">
              Materiality & Clause Delta Engine
            </h1>
            <p className="text-xs text-stone-600 max-w-3xl mt-0.5">
              Every amendment across Notice Inviting Tender (NIT), Corrigenda 1 & 2, Pre-Bid replies, and Revised BOQs. Strict human-in-the-loop audit verification.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-stone-500">Active Lens:</span>
            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-stone-900 text-white">
              {activeRole}
            </span>
          </div>
        </div>

        {/* Filter Badges Bar */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => setSelectedMateriality('ALL')}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
              selectedMateriality === 'ALL'
                ? 'bg-stone-900 text-white font-bold'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Materialities ({tender.changes.length})
          </button>

          <button
            onClick={() => setSelectedMateriality('CRITICAL')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors flex items-center space-x-1.5 ${
              selectedMateriality === 'CRITICAL'
                ? 'bg-red-700 text-white font-bold'
                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>CRITICAL ({criticalCount})</span>
          </button>

          <button
            onClick={() => setSelectedMateriality('HIGH')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors flex items-center space-x-1.5 ${
              selectedMateriality === 'HIGH'
                ? 'bg-amber-700 text-white font-bold'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span>HIGH ({highCount})</span>
          </button>

          <button
            onClick={() => setSelectedMateriality('MEDIUM')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors flex items-center space-x-1.5 ${
              selectedMateriality === 'MEDIUM'
                ? 'bg-blue-700 text-white font-bold'
                : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>MEDIUM ({mediumCount})</span>
          </button>

          <button
            onClick={() => setSelectedMateriality('LOW')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
              selectedMateriality === 'LOW'
                ? 'bg-stone-700 text-white font-bold'
                : 'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200'
            }`}
          >
            <span>LOW ({lowCount})</span>
          </button>

          <button
            onClick={() => setSelectedMateriality('INFORMATIONAL')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
              selectedMateriality === 'INFORMATIONAL'
                ? 'bg-slate-700 text-white font-bold'
                : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span>INFO ({infoCount})</span>
          </button>

          <div className="h-4 w-px bg-stone-300 mx-1 hidden sm:block"></div>

          {/* Verification Status Filter */}
          <select
            value={verificationFilter}
            onChange={(e: any) => setVerificationFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-stone-300 rounded font-mono bg-white text-stone-800"
          >
            <option value="ALL">Audit Status: All</option>
            <option value="UNREVIEWED">Unreviewed</option>
            <option value="CONFIRMED">Human Confirmed</option>
            <option value="FLAGGED">Flagged</option>
          </select>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1 text-xs border border-stone-300 rounded font-mono bg-white text-stone-800"
          >
            <option value="ALL">Category: All ({categories.length})</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search and Results Counter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs font-mono text-stone-500">
          Showing <strong className="text-stone-900">{filteredChanges.length}</strong> of {tender.changes.length} Material Changes
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter changes by clause, term, or document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          />
        </div>
      </div>

      {/* Change Cards Grid */}
      <div className="space-y-4">
        {filteredChanges.length === 0 ? (
          tender.changes.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-lg p-10 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 uppercase tracking-wide">
                  0 MATERIAL CHANGES DETECTED
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-2">Baseline Tender with Zero Amendments</h3>
                <p className="text-xs text-stone-600 max-w-lg mx-auto mt-1 leading-relaxed">
                  The document intelligence engine analyzed the uploaded tender documents. No corrigenda, deadline extensions, turnover threshold shifts, or specification amendments were identified.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-stone-500 bg-stone-50 px-3 py-1.5 rounded border border-stone-200 inline-block">
                  Provenance: {tender.provenance} • Documents: {tender.documents?.length || 1}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-lg p-12 text-center">
              <Info className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-stone-700 font-semibold text-sm">No changes match the selected filter criteria</p>
              <p className="text-stone-500 text-xs mt-1">Try resetting the materiality, role, or category filters.</p>
            </div>
          )
        ) : (
          filteredChanges.map((change) => {
            const isCritical = change.materiality === 'CRITICAL';
            const isHigh = change.materiality === 'HIGH';
            
            return (
              <div
                key={change.id}
                id={`change-card-${change.id}`}
                className={`bg-white border rounded-lg p-5 transition-all shadow-xs space-y-4 ${
                  isCritical 
                    ? 'border-l-4 border-l-red-600 border-stone-200' 
                    : isHigh 
                    ? 'border-l-4 border-l-amber-500 border-stone-200' 
                    : 'border-stone-200'
                }`}
              >
                {/* Header: Materiality, Category, Change Type, and Title */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                        isCritical ? 'bg-red-50 text-red-700 border border-red-200' :
                        isHigh ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {change.materiality} CHANGE
                      </span>

                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold font-mono bg-stone-100 text-stone-700 border border-stone-200">
                        {change.category}
                      </span>

                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-stone-500 bg-stone-50 border border-stone-150">
                        {change.changeType.replace('_', ' ')}
                      </span>

                      <span className="text-[10px] font-mono text-stone-400">
                        Confidence: <strong className="text-stone-600">{change.confidence}</strong>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 leading-snug">
                      {change.title}
                    </h3>
                  </div>

                  {/* Audit Review State */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {change.extractionMethod && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-stone-500 bg-stone-100 border border-stone-200">
                        {change.extractionMethod}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                      change.verificationStatus === 'CONFIRMED' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : change.verificationStatus === 'FLAGGED'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : change.verificationStatus === 'FAILED_VALIDATION'
                        ? 'bg-red-50 text-red-700 border border-red-300 font-bold'
                        : 'bg-stone-100 text-stone-600 border border-stone-200'
                    }`}>
                      {change.verificationStatus === 'CONFIRMED' ? '✓ Human Confirmed' 
                        : change.verificationStatus === 'FAILED_VALIDATION' ? '⚠ QUARANTINED' 
                        : change.verificationStatus}
                    </span>
                  </div>
                </div>

                {/* BEFORE vs AFTER Comparison Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
                  
                  {/* BEFORE */}
                  <div className="bg-stone-50 border border-stone-200 rounded p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 font-mono uppercase">
                      <span>BEFORE (Original Tender)</span>
                      <span>{change.previousCitation ? change.previousCitation.documentName : 'Original RFP'}</span>
                    </div>

                    {change.beforeValue && (
                      <div className="font-mono font-bold text-stone-800 text-sm py-0.5">
                        {change.beforeValue}
                      </div>
                    )}

                    <p className="font-serif text-stone-700 italic leading-relaxed text-[11px]">
                      "{change.originalText}"
                    </p>
                  </div>

                  {/* AFTER */}
                  <div className="bg-blue-50/40 border border-blue-200 rounded p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-blue-800 font-mono uppercase">
                      <span>AFTER (Superseding Corrigendum)</span>
                      <span>{change.sourceCitation.documentName}</span>
                    </div>

                    {change.afterValue && (
                      <div className="font-mono font-bold text-blue-900 text-sm py-0.5">
                        {change.afterValue}
                      </div>
                    )}

                    <p className="font-serif text-stone-900 font-medium leading-relaxed text-[11px]">
                      "{change.updatedText}"
                    </p>
                  </div>

                </div>

                {/* Impact & Action Required */}
                <div className="bg-stone-50/60 rounded border border-stone-150 p-3 text-xs space-y-2 font-sans">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold font-mono text-stone-600 uppercase block">
                        WHY DOES IT MATTER? (IMPACT)
                      </span>
                      <p className="text-stone-800 text-[11px] mt-0.5 leading-relaxed">
                        {change.impactExplanation}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold font-mono text-blue-900 uppercase block">
                        WHAT DO I NOW NEED TO DO? (ACTION REQUIRED)
                      </span>
                      <p className="text-stone-900 font-medium text-[11px] mt-0.5 leading-relaxed">
                        {change.actionRequired}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Traceable Source Citation & Action Buttons */}
                <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  
                  {/* Source Citation */}
                  <div className="flex items-center space-x-1.5 text-stone-500 font-mono text-[11px]">
                    <span className="font-semibold text-stone-700">Source Citation:</span>
                    <span className="text-stone-900 underline truncate max-w-[280px]">
                      {change.sourceCitation.documentName}
                    </span>
                    <span>
                      (Page {change.sourceCitation.pageNumber !== undefined && change.sourceCitation.pageNumber !== null ? change.sourceCitation.pageNumber : 'UNKNOWN'}, {change.sourceCitation.sectionNumber || 'Section UNKNOWN'})
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center space-x-2 flex-wrap">
                    
                    <button
                      id={`view-source-btn-${change.id}`}
                      onClick={() => onOpenSourceViewer(
                        change.sourceCitation.documentName,
                        change.sourceCitation.pageNumber,
                        change.sourceCitation.exactSnippet,
                        change.extractionMethod,
                        change.verificationStatus,
                        change.sourceCitation.sectionNumber
                      )}
                      className="px-2.5 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-[11px] font-semibold flex items-center space-x-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-blue-600" />
                      <span>
                        View Source (p.{change.sourceCitation.pageNumber !== undefined && change.sourceCitation.pageNumber !== null ? change.sourceCitation.pageNumber : 'UNKNOWN'})
                      </span>
                    </button>

                    <button
                      id={`side-by-side-btn-${change.id}`}
                      onClick={() => onOpenSideBySide(change)}
                      className="px-2.5 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-[11px] font-semibold flex items-center space-x-1 transition-colors"
                    >
                      <Maximize2 className="w-3 h-3 text-stone-600" />
                      <span>Side-by-Side Diff</span>
                    </button>

                    <button
                      id={`create-task-btn-${change.id}`}
                      onClick={() => onCreateTaskFromChange(change)}
                      className="px-2.5 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-[11px] font-semibold flex items-center space-x-1 transition-colors"
                    >
                      <PlusCircle className="w-3 h-3 text-indigo-600" />
                      <span>Create Task</span>
                    </button>

                    {change.verificationStatus !== 'CONFIRMED' ? (
                      <button
                        id={`mark-reviewed-btn-${change.id}`}
                        onClick={() => onConfirmChange(change.id)}
                        className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-[11px] font-bold flex items-center space-x-1 shadow-2xs transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        <span>Confirm Review</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-mono text-[11px] font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    )}

                    <button
                      onClick={() => onFlagChange(change.id, 'Flagged for further pre-bid clarification check')}
                      className="p-1.5 text-stone-400 hover:text-amber-700 transition-colors"
                      title="Flag ambiguity"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
