import React from 'react';
import { X, ExternalLink, CheckCircle2, Flag, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { MaterialChange } from '../types';

interface SideBySideModalProps {
  change: MaterialChange | null;
  onClose: () => void;
  onConfirmChange: (id: string) => void;
  onFlagChange: (id: string, note: string) => void;
  onOpenSourceViewer: (
    docName: string, 
    page?: number | null, 
    snippet?: string,
    extractionMethod?: any,
    verificationStatus?: any,
    sectionNumber?: string | null
  ) => void;
}

export const SideBySideModal: React.FC<SideBySideModalProps> = ({
  change,
  onClose,
  onConfirmChange,
  onFlagChange,
  onOpenSourceViewer
}) => {
  if (!change) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-stone-300 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
              change.materiality === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
              change.materiality === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
              'bg-blue-950 text-blue-400 border border-blue-800'
            }`}>
              {change.materiality} CHANGE
            </span>
            <span className="text-xs text-stone-400 font-mono">Category: <strong className="text-white">{change.category}</strong></span>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Title & Key Requirement */}
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-sans leading-snug">
              {change.title}
            </h2>
            <p className="text-xs font-mono text-stone-500 mt-1">
              Requirement Key: <span className="font-semibold text-stone-700">{change.requirementKey}</span>
            </p>
          </div>

          {/* SIDE BY SIDE COMPARISON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left: Original Text */}
            <div className="border border-stone-200 rounded-lg p-4 bg-stone-50/70 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-[11px] font-bold text-stone-600 uppercase font-mono tracking-wider">
                  Original RFP Clause (Before)
                </span>
                <span className="text-[10px] font-mono text-stone-500">
                  {change.previousCitation ? change.previousCitation.documentName : 'Baseline Tender'}
                </span>
              </div>

              {change.beforeValue && (
                <div className="p-2.5 rounded bg-stone-200/60 border border-stone-300 font-mono text-xs font-bold text-stone-900">
                  <span className="text-[10px] text-stone-500 block uppercase">Original Threshold / Specification</span>
                  {change.beforeValue}
                </div>
              )}

              <div className="p-3 bg-white rounded border border-stone-200 font-serif text-xs text-stone-800 leading-relaxed min-h-[90px]">
                "{change.originalText}"
              </div>

              {change.previousCitation && (
                <div className="text-[11px] font-mono text-stone-500 flex items-center justify-between">
                  <span>Page {change.previousCitation.pageNumber !== undefined && change.previousCitation.pageNumber !== null ? change.previousCitation.pageNumber : 'UNKNOWN'}, {change.previousCitation.sectionNumber || 'Section UNKNOWN'}</span>
                  <button
                    onClick={() => onOpenSourceViewer(
                      change.previousCitation!.documentName,
                      change.previousCitation!.pageNumber,
                      change.previousCitation!.exactSnippet,
                      change.extractionMethod,
                      change.verificationStatus,
                      change.previousCitation!.sectionNumber
                    )}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    <span>View Baseline</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-1" />
                  </button>
                </div>
              )}
            </div>

            {/* Right: Updated Text */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/30 space-y-3">
              <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                <span className="text-[11px] font-bold text-blue-900 uppercase font-mono tracking-wider">
                  Superseding Corrigendum (After)
                </span>
                <span className="text-[10px] font-mono text-blue-700 font-semibold">
                  {change.sourceCitation.documentName}
                </span>
              </div>

              {change.afterValue && (
                <div className="p-2.5 rounded bg-blue-100/70 border border-blue-300 font-mono text-xs font-bold text-blue-900">
                  <span className="text-[10px] text-blue-700 block uppercase">Revised Threshold / Specification</span>
                  {change.afterValue}
                </div>
              )}

              <div className="p-3 bg-white rounded border border-blue-200 font-serif text-xs text-stone-900 leading-relaxed min-h-[90px]">
                "{change.updatedText}"
              </div>

              <div className="text-[11px] font-mono text-blue-900 flex items-center justify-between">
                <span>Page {change.sourceCitation.pageNumber !== undefined && change.sourceCitation.pageNumber !== null ? change.sourceCitation.pageNumber : 'UNKNOWN'}, {change.sourceCitation.sectionNumber || 'Section UNKNOWN'}</span>
                <button
                  onClick={() => onOpenSourceViewer(
                    change.sourceCitation.documentName,
                    change.sourceCitation.pageNumber,
                    change.sourceCitation.exactSnippet,
                    change.extractionMethod,
                    change.verificationStatus,
                    change.sourceCitation.sectionNumber
                  )}
                  className="text-blue-700 hover:text-blue-900 font-bold flex items-center"
                >
                  <span>View Source</span>
                  <ExternalLink className="w-2.5 h-2.5 ml-1" />
                </button>
              </div>
            </div>

          </div>

          {/* AI INTERPRETATION & IMPACT ANALYSIS */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-4 text-xs font-sans">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-bold text-stone-700 uppercase font-mono block">
                  1. WHY DOES IT MATTER? (IMPACT ANALYSIS)
                </span>
                <p className="text-stone-800 mt-1 leading-relaxed">
                  {change.impactExplanation}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-stone-700 uppercase font-mono block">
                  2. WHAT DOES IT INVALIDATE?
                </span>
                <p className="text-stone-800 mt-1 leading-relaxed">
                  {change.invalidatesText || 'Previous documentation drafts or quotes relying on the original clause.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-bold text-blue-900 uppercase font-mono block">
                  3. WHAT DO I NOW NEED TO DO? (ACTION REQUIRED)
                </span>
                <p className="text-stone-900 font-medium mt-1 leading-relaxed">
                  {change.actionRequired}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase font-mono block">
                  4. WHAT REMAINS UNCERTAIN?
                </span>
                <p className="text-stone-800 mt-1 leading-relaxed">
                  {change.unresolvedAmbiguity || 'None. Definitive amendment approved by competent authority.'}
                </p>
              </div>
            </div>

            {/* Confidence & Traceability */}
            <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between text-[11px] font-mono text-stone-600 gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">AI Confidence:</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold font-mono">
                  {change.confidence} CONFIDENCE
                </span>
                <span className="text-stone-500 font-sans">({change.confidenceReason})</span>
              </div>

              <div>
                <span>Relevant Roles: </span>
                <span className="font-semibold text-stone-800">{change.relevantRoles.join(', ')}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-stone-100 px-6 py-4 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs font-mono text-stone-500">
            Audit State: <strong className="text-stone-800 uppercase">{change.verificationStatus}</strong>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onFlagChange(change.id, 'Flagged for Senior Bid Reviewer inquiry');
                onClose();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 border border-stone-300 rounded text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 transition-colors font-mono"
            >
              <Flag className="w-3.5 h-3.5 text-amber-600" />
              <span>Flag / Challenge</span>
            </button>

            <button
              onClick={() => {
                onConfirmChange(change.id);
                onClose();
              }}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold font-mono shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm & Mark Reviewed</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
