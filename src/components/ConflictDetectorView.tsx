import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  HelpCircle, 
  ArrowRight, 
  ShieldAlert,
  FileText,
  AlertOctagon
} from 'lucide-react';
import { Tender } from '../types';

interface ConflictDetectorViewProps {
  tender: Tender;
  onOpenSourceViewer: (docName: string, page: number, snippet: string) => void;
}

export const ConflictDetectorView: React.FC<ConflictDetectorViewProps> = ({
  tender,
  onOpenSourceViewer
}) => {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-red-50 text-red-800 border border-red-200">
                CROSS-DOCUMENT CONFLICT ENGINE
              </span>
              <span className="text-xs text-stone-500 font-mono">
                Multi-clause Contradiction Scanner
              </span>
            </div>
            <h1 className="text-xl font-bold text-stone-900 mt-1 font-sans">
              Detected Conflicts & Substantive Ambiguities
            </h1>
            <p className="text-xs text-stone-600 max-w-3xl mt-0.5">
              Identifies conflicting statements between the main NIT body, Annexures, pre-bid replies, and corrigenda to prevent bid rejection or disqualification.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold font-mono px-3 py-1.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
              {tender.conflicts.filter(c => c.status === 'OPEN').length} Active Unresolved Ambiguities
            </span>
          </div>
        </div>
      </div>

      {/* Conflict Cards */}
      <div className="space-y-4">
        {tender.conflicts.map((conflict) => {
          const { statementA, statementB } = conflict;
          const isResolved = conflict.status === 'RESOLVED_BY_CORRIGENDUM';
          const clarificationRequested = conflict.status === 'CLARIFICATION_REQUESTED';
          const pageA = typeof statementA.pageNumber === 'number' && Number.isInteger(statementA.pageNumber) && statementA.pageNumber > 0
            ? statementA.pageNumber
            : null;
          const pageB = typeof statementB.pageNumber === 'number' && Number.isInteger(statementB.pageNumber) && statementB.pageNumber > 0
            ? statementB.pageNumber
            : null;

          return (
            <div
              key={conflict.id}
              className={`bg-white border rounded-lg p-5 shadow-xs space-y-4 ${
                isResolved 
                  ? 'border-stone-200' 
                  : 'border-l-4 border-l-amber-500 border-stone-200'
              }`}
            >
              {/* Conflict Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  {isResolved ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="text-base font-bold text-stone-900 leading-snug">
                      {conflict.title}
                    </h3>
                    <span className="text-[10px] font-mono text-stone-500">Category: {conflict.category}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase self-start sm:self-auto ${
                  isResolved
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : clarificationRequested
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {isResolved ? 'Resolved by Corrigendum' : clarificationRequested ? 'Clarification requested' : 'Active unresolved ambiguity'}
                </span>
              </div>

              {/* Dual Document Citation Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                
                {/* Source A */}
                <div className="bg-stone-50 border border-stone-200 rounded p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-stone-700 border-b border-stone-200 pb-1">
                    <span>Document A (Primary Section)</span>
                    <span className="text-stone-500">{statementA.documentName}</span>
                  </div>

                  <p className="font-serif italic text-stone-800 text-[11px] leading-relaxed">
                    "{statementA.text}"
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-stone-500">
                    <span>{pageA ? `Page ${pageA}` : 'Page unavailable'}, {statementA.clause}</span>
                    {pageA && (
                      <button
                        onClick={() => onOpenSourceViewer(statementA.documentName, pageA, statementA.text)}
                        className="text-blue-600 hover:text-blue-800 font-bold flex items-center"
                      >
                        <span>View Clause A</span>
                        <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Source B */}
                <div className="bg-stone-50 border border-stone-200 rounded p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-stone-700 border-b border-stone-200 pb-1">
                    <span>Document B (Contradictory Annexure/Query)</span>
                    <span className="text-stone-500">{statementB.documentName}</span>
                  </div>

                  <p className="font-serif italic text-stone-800 text-[11px] leading-relaxed">
                    "{statementB.text}"
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-stone-500">
                    <span>{pageB ? `Page ${pageB}` : 'Page unavailable'}, {statementB.clause}</span>
                    {pageB && (
                      <button
                        onClick={() => onOpenSourceViewer(statementB.documentName, pageB, statementB.text)}
                        className="text-blue-600 hover:text-blue-800 font-bold flex items-center"
                      >
                        <span>View Clause B</span>
                        <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Resolution & Impact */}
              <div className="bg-stone-50/70 rounded border border-stone-200 p-3 text-xs space-y-1.5 font-sans">
                <span className="text-[10px] font-bold font-mono uppercase text-stone-600 block">
                  Analysis & Recommended Action:
                </span>
                <p className="text-stone-800 leading-relaxed text-[11px]">
                  {conflict.conflictDescription}
                </p>
                {conflict.suggestedClarificationQuery && (
                  <p className="text-emerald-900 font-semibold font-mono text-[11px] pt-1">
                    Suggested clarification: {conflict.suggestedClarificationQuery}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
