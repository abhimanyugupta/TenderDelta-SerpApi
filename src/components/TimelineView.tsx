import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ExternalLink,
  ChevronDown,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Tender, TenderDocument } from '../types';

interface TimelineViewProps {
  tender: Tender;
  onOpenSourceViewer: (docName: string, page: number, snippet: string) => void;
  onSelectDocument: (doc: TenderDocument) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  tender,
  onOpenSourceViewer,
  onSelectDocument
}) => {
  const [selectedAsOfDate, setSelectedAsOfDate] = useState<string>('2026-08-10');
  const [reconstructionResult, setReconstructionResult] = useState<string | null>(null);

  // Version Reconstruction Logic
  const handleReconstructVersion = () => {
    const date = new Date(selectedAsOfDate);
    const dateJuly31 = new Date('2026-07-31');
    const dateAug04 = new Date('2026-08-04');
    const dateAug08 = new Date('2026-08-08');

    if (date <= dateJuly31) {
      setReconstructionResult(`RECONSTRUCTED STATE AS OF ${selectedAsOfDate} (VERSION 1.0 - ORIGINAL NIT):
• Average Turnover Requirement: ₹10.00 Crore
• Submission Deadline: 12-Aug-2026 at 15:00 hrs
• EMD Amount: ₹18.50 Lakhs in Section 4.2 (Ambiguous ₹20.00 Lakhs in Annexure VII)
• GPU Node RAM: 512 GB DDR5 per server (8 nodes)
• InfiniBand Switches: 2 Units
• OEM India Continuous Presence: 7 Continuous Years Required
• Make in India Certificate: Self-declaration allowed`);
    } else if (date <= dateAug04) {
      setReconstructionResult(`RECONSTRUCTED STATE AS OF ${selectedAsOfDate} (VERSION 2.0 - POST CORRIGENDUM 1):
• Average Turnover Requirement: ₹10.00 Crore (Unchanged)
• Submission Deadline: 12-Aug-2026 (Unchanged)
• EMD Amount: ₹18.50 Lakhs CONFIRMED (Annexure VII ₹20L typographical error deleted)
• Pre-bid Meeting: Conducted in Hybrid mode on 05-Aug-2026
• GPU Node RAM: 512 GB DDR5
• OEM India Presence: 7 Years`);
    } else if (date <= dateAug08) {
      setReconstructionResult(`RECONSTRUCTED STATE AS OF ${selectedAsOfDate} (VERSION 3.0 - POST PRE-BID CLARIFICATIONS):
• Average Turnover Requirement: ₹10.00 Crore (Still at original threshold)
• Submission Deadline: 12-Aug-2026
• GPU Node RAM: Upgraded to 1024 GB (1TB) DDR5 as per Query #14 Reply
• OEM India Presence: Relaxed from 7 to 5 continuous years (Query #22 Reply)
• Make in India Certificate: Statutory Auditor Certificate required (Query #39 Reply)`);
    } else {
      setReconstructionResult(`RECONSTRUCTED STATE AS OF ${selectedAsOfDate} (VERSION 5.0 - CURRENT APPLICABLE TENDER):
• Average Turnover Requirement: ₹15.00 Crore (+50% increase via Corrigendum 2)
• Submission Deadline: EXTENDED to 19-Aug-2026 15:00 hrs (+7 Calendar Days)
• GPU Node RAM: 1024 GB (1TB) DDR5 per node (Revised BOQ Schedule A)
• InfiniBand Switches: 4 Units (+100% quantity increase)
• Active Optical Cables: 32 Nos newly inserted into BOQ
• On-Site Warranty SLA: 4-Hour On-Site Support Commitment with local spares warehouse
• Payment of Tender Fee: CPPP Integrated Gateway only`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-amber-50 text-amber-800 border border-amber-200">
                CORRIGENDUM LIFECYCLE
              </span>
              <span className="text-xs text-stone-500 font-mono">
                Chronological Audit Trail • 5 Verified Releases
              </span>
            </div>
            <h1 className="text-xl font-bold text-stone-900 mt-1 font-sans">
              Tender Evolution & Deadline Timeline
            </h1>
            <p className="text-xs text-stone-600 max-w-3xl mt-0.5">
              Trace how requirements mutated from the original Notice Inviting Tender through each subsequent corrigendum, reply matrix, and revised schedule.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold font-mono px-3 py-1.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
              Submission: 19-Aug-2026 (+7D Extended)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Vertical Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs">
            <h2 className="text-sm font-bold text-stone-900 uppercase font-mono tracking-wider mb-6 pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>Chronological Amendment Cascade</span>
              <span className="text-xs font-normal text-stone-500">v1.0 (Original) → v5.0 (Current)</span>
            </h2>

            {/* Vertical Nodes */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-300">
              
              {/* NODE 1: Original NIT */}
              <div className="relative group">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-xs flex items-center justify-center"></div>
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 transition-all hover:border-blue-300">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-blue-100 text-blue-800">
                      VERSION 1.0 • ORIGINAL NIT
                    </span>
                    <span className="text-xs font-mono text-stone-500">Published: 28-Jul-2026</span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900">
                    Notice Inviting Tender & Technical Specifications
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Baseline document defining the scope of work for 8x GPU nodes (512GB RAM), 2x InfiniBand switches, and standard GCC/SCC terms.
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-stone-200/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-500">Doc: NIT_089_T04_Original_Tender.pdf (68 pages)</span>
                    <button
                      onClick={() => onOpenSourceViewer('NIT_089_T04_Original_Tender.pdf', 1, 'Tender Notice No: IISEAR/PROC/CC/2026/089-T04')}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                    >
                      <span>Inspect PDF</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* NODE 2: Corrigendum 1 */}
              <div className="relative group">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-stone-500 border-4 border-white shadow-xs"></div>
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 transition-all hover:border-stone-400">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-stone-200 text-stone-800">
                      VERSION 2.0 • CORRIGENDUM 1
                    </span>
                    <span className="text-xs font-mono text-stone-500">Published: 03-Aug-2026</span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900">
                    Pre-Bid Meeting Mode Clarification & EMD Typo Rectification
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Corrected typographical discrepancy between NIT Section 4.2 (₹18.50L) and Annexure VII Form C (₹20.00L). Enabled virtual Webex link for pre-bid conference.
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-stone-200/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-800 font-semibold">1 Conflict Resolved • 1 Change</span>
                    <button
                      onClick={() => onOpenSourceViewer('Corrigendum_1_Extension_and_EMD.pdf', 1, 'Rectification of EMD Amount')}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                    >
                      <span>Inspect Corrigendum 1</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* NODE 3: Pre-Bid Response */}
              <div className="relative group">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-indigo-600 border-4 border-white shadow-xs"></div>
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 transition-all hover:border-indigo-300">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-indigo-100 text-indigo-800">
                      VERSION 3.0 • PRE-BID CLARIFICATION REPLY MATRIX
                    </span>
                    <span className="text-xs font-mono text-stone-500">Published: 07-Aug-2026</span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900">
                    Official Responses to 54 Prospective Bidder Queries
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Major concessions granted: Approved 1TB RAM per GPU node (Query #14), relaxed OEM track record from 7 to 5 years (Query #22), mandated statutory auditor Make in India Class-I certificate (Query #39).
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-stone-200/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-indigo-800 font-semibold">3 Substantive Amendments</span>
                    <button
                      onClick={() => onOpenSourceViewer('Pre_Bid_Clarifications_Reply_Matrix.pdf', 4, 'Query #14 RAM per GPU node')}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                    >
                      <span>Inspect Reply Matrix</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* NODE 4: Corrigendum 2 */}
              <div className="relative group">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-red-600 border-4 border-white shadow-xs"></div>
                <div className="bg-red-50/40 border border-red-200 rounded-lg p-4 transition-all hover:border-red-400">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-red-100 text-red-800">
                      VERSION 4.0 • CORRIGENDUM 2 (CRITICAL)
                    </span>
                    <span className="text-xs font-mono text-stone-500">Published: 09-Aug-2026</span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900">
                    Turnover Increase to ₹15 Cr, 4-Hour SLA & 7-Day Deadline Extension
                  </h3>
                  <p className="text-xs text-stone-700 mt-1">
                    Substantive eligibility barrier: Average Annual Turnover increased by 50% from ₹10 Cr to ₹15 Cr. Submission deadline extended from 12-Aug to 19-Aug-2026 (+7 Days). Back-to-back 4-hour SLA mandated.
                  </p>

                  {/* Deadline Shift Visual Block */}
                  <div className="my-3 p-2.5 bg-white rounded border border-red-200 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-stone-500 text-[10px] block">OLD DEADLINE:</span>
                      <span className="line-through text-stone-600">12-Aug-2026 15:00 IST</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-red-600 mx-2" />
                    <div>
                      <span className="text-red-700 text-[10px] font-bold block">NEW DEADLINE:</span>
                      <span className="font-bold text-red-900">19-Aug-2026 15:00 IST</span>
                    </div>
                    <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 font-bold text-xs">
                      +7 DAYS
                    </span>
                  </div>

                  <div className="pt-2 border-t border-red-200 flex items-center justify-between text-xs font-mono">
                    <span className="text-red-800 font-bold">4 Material Changes</span>
                    <button
                      onClick={() => onOpenSourceViewer('Corrigendum_2_Substantive_Amendments.pdf', 1, 'Bid Submission End Date is hereby EXTENDED')}
                      className="text-blue-700 hover:text-blue-900 font-bold flex items-center"
                    >
                      <span>Inspect Corrigendum 2</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* NODE 5: Revised BOQ */}
              <div className="relative group">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-600 border-4 border-white shadow-xs"></div>
                <div className="bg-emerald-50/40 border border-emerald-200 rounded-lg p-4 transition-all hover:border-emerald-400">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-emerald-100 text-emerald-800">
                      VERSION 5.0 • REVISED FINANCIAL BOQ (CURRENT)
                    </span>
                    <span className="text-xs font-mono text-stone-500">Published: 09-Aug-2026</span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900">
                    Revised Electronic Financial Schedule (BOQ_REV_V2)
                  </h3>
                  <p className="text-xs text-stone-700 mt-1">
                    Mandatory spreadsheet schedule reflecting 1024GB RAM per node, 4x InfiniBand switches, and 32x 100G AOC cables. Bidders must upload this revised format only.
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-emerald-200 flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-800 font-bold">3 BOQ Adjustments • Final Binding Version</span>
                    <button
                      onClick={() => onOpenSourceViewer('Revised_Financial_BOQ_v2.xlsx', 1, 'Schedule A Item 1.01')}
                      className="text-blue-700 hover:text-blue-900 font-bold flex items-center"
                    >
                      <span>Inspect BOQ</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right 1 Column: Version Reconstruction Engine */}
        <div className="space-y-5">
          
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-stone-900 uppercase font-mono tracking-wider">
                Version Reconstruction
              </h2>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Audit query: <strong className="text-stone-800">"What was the legally binding tender requirement as of a specific calendar date?"</strong>
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700 font-mono">
                Select Historic Snapshot Date:
              </label>
              <input
                type="date"
                value={selectedAsOfDate}
                onChange={(e) => setSelectedAsOfDate(e.target.value)}
                min="2026-07-28"
                max="2026-08-20"
                className="w-full px-3 py-2 border border-stone-300 rounded text-xs font-mono bg-stone-50 text-stone-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleReconstructVersion}
              className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-bold font-mono transition-colors shadow-xs"
            >
              Reconstruct Requirements Snapshot
            </button>

            {reconstructionResult && (
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono space-y-2">
                <span className="text-[10px] font-bold text-blue-800 uppercase block border-b border-stone-200 pb-1">
                  Reconstructed Requirements Output:
                </span>
                <pre className="text-[11px] text-stone-800 whitespace-pre-wrap font-mono leading-relaxed">
                  {reconstructionResult}
                </pre>
              </div>
            )}
          </div>

          {/* Quick Dates Reference */}
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-3 text-xs">
            <h3 className="text-xs font-bold text-stone-900 uppercase font-mono tracking-wider border-b border-stone-100 pb-2">
              Statutory Procurement Milestones
            </h3>
            
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-mono">Notice Inviting Tender:</span>
                <span className="font-semibold font-mono text-stone-800">28-Jul-2026</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-mono">Pre-Bid Conference:</span>
                <span className="font-semibold font-mono text-stone-800">05-Aug-2026</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-mono">Corrigendum 2 Issued:</span>
                <span className="font-semibold font-mono text-stone-800">09-Aug-2026</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-mono">Revised Submission End:</span>
                <span className="font-bold font-mono text-red-700">19-Aug-2026 15:00</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-mono">Technical Bid Opening:</span>
                <span className="font-bold font-mono text-stone-900">20-Aug-2026 15:30</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
