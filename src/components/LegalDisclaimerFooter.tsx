import React from 'react';
import { ShieldCheck, Info, Scale, ExternalLink } from 'lucide-react';

interface LegalDisclaimerFooterProps {
  onOpenMethodology?: () => void;
  onOpenSubscription?: () => void;
}

export const LegalDisclaimerFooter: React.FC<LegalDisclaimerFooterProps> = ({
  onOpenMethodology,
  onOpenSubscription
}) => {
  return (
    <footer className="mt-12 border-t border-stone-200 bg-stone-50 py-8 px-4 sm:px-6 lg:px-8 text-xs text-stone-500 font-sans">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Compliance Notice Banner */}
        <div className="p-3.5 bg-amber-50/70 rounded-lg border border-amber-200/80 flex items-start space-x-3 text-stone-800">
          <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-[11px] leading-relaxed">
            <span className="font-bold text-amber-900 block font-mono text-[10px] uppercase tracking-wide">
              MANDATORY PROCUREMENT & LEGAL DISCLAIMER
            </span>
            <p>
              TenderDelta provides AI-assisted document analysis, version diffing, and compliance workflow support. It does <strong>not</strong> provide legal advice, formal procurement advice, or guarantee bid responsiveness or award. All critical findings, eligibility limits, turnover thresholds, and BOQ line items must be independently reviewed against the official published tender documents before bid submission on CPPP, GeM, or state portals.
            </p>
          </div>
        </div>

        {/* Footer Links & Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-stone-200 text-[11px] font-mono">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-stone-800">TENDERDELTA</span>
            <span>•</span>
            <span>KNOW WHAT CHANGED. KNOW WHAT IT MEANS. KNOW WHAT TO DO.</span>
          </div>

          <div className="flex items-center space-x-4">
            {onOpenMethodology && (
              <button
                onClick={onOpenMethodology}
                className="text-stone-600 hover:text-stone-900 transition-colors underline"
              >
                Procurement reference notes
              </button>
            )}

            {onOpenSubscription && (
              <button
                onClick={onOpenSubscription}
                className="text-stone-600 hover:text-stone-900 transition-colors underline"
              >
                Pricing & Quotas
              </button>
            )}

            <span className="text-stone-400">Local prototype • Review source documents</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
