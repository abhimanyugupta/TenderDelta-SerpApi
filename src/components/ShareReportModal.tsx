import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Sparkles, 
  Building2, 
  User, 
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';
import { Tender } from '../types';

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tender: Tender | null;
}

export const ShareReportModal: React.FC<ShareReportModalProps> = ({
  isOpen,
  onClose,
  tender
}) => {
  const [consultancyName, setConsultancyName] = useState('');
  const [clientName, setClientName] = useState('');
  const [advisorName, setAdvisorName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !tender) return null;

  const shareUrl = `https://example.invalid/briefs/share/${encodeURIComponent(tender.id)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-stone-300 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold font-mono tracking-tight text-white">
              Export & Share Client Tender Change Brief
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs font-sans">
          
          {/* Brief Overview Header */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950 font-mono text-xs">
                {tender.changes.length} Material Tender Changes Detected
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {tender.referenceNumber}
              </span>
            </div>
            <p className="text-stone-700 text-[11px] leading-relaxed">
              Export an executive advisory brief with cited before-and-after clause diffs, qualification risks, and compliance action items for your client or evaluation board.
            </p>
          </div>

          {/* Consultant & Client Customization */}
          <div className="space-y-3 pt-1">
            <h3 className="font-bold text-stone-900 font-mono uppercase text-[11px] tracking-wider">
              Advisory Branding & Header Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Advisory Firm Name</label>
                <input
                  type="text"
                  value={consultancyName}
                  onChange={(e) => setConsultancyName(e.target.value)}
                  placeholder="Example advisory firm"
                  className="w-full px-3 py-1.5 border border-stone-300 rounded font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Client Recipient Organization</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Example client organization"
                  className="w-full px-3 py-1.5 border border-stone-300 rounded font-sans text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Prepared By (Lead Advisor / Bid Manager)</label>
              <input
                type="text"
                value={advisorName}
                onChange={(e) => setAdvisorName(e.target.value)}
                placeholder="Advisor name"
                className="w-full px-3 py-1.5 border border-stone-300 rounded font-sans text-xs"
              />
            </div>
          </div>

          {/* Shareable Link Box */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <label className="block text-stone-700 font-bold font-mono text-[11px] uppercase tracking-wider">
                Client Web View Link Format
              </label>
              <span className="text-[10px] font-mono text-stone-500">[SAMPLE LINK FORMAT]</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-grow px-3 py-2 bg-stone-50 border border-stone-300 rounded font-mono text-[11px] text-stone-700 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-mono font-bold text-xs rounded transition-colors flex items-center space-x-1.5 flex-shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy Sample Link'}</span>
              </button>
            </div>
            <p className="text-[10px] text-stone-500 font-mono">
              Note: Direct cloud sharing server is not connected in this MVP. Use the <strong>Print / Save PDF</strong> button below for offline and email distribution.
            </p>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[10px] text-stone-500 font-mono">
              TENDERDELTA Export Utility
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-stone-300 rounded text-stone-700 hover:bg-stone-50 font-mono"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold font-mono flex items-center space-x-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
