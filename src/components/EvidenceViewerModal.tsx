import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check,
  FileCode,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { TenderDocument, ExtractionMethod, FactVerificationStatus } from '../types';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface EvidenceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  pageNumber?: number | null;
  sectionNumber?: string | null;
  exactSnippet: string;
  document?: TenderDocument | null;
  extractionMethod?: ExtractionMethod;
  verificationStatus?: FactVerificationStatus;
}

export const EvidenceViewerModal: React.FC<EvidenceViewerModalProps> = ({
  isOpen,
  onClose,
  documentName,
  pageNumber,
  sectionNumber,
  exactSnippet,
  document,
  extractionMethod,
  verificationStatus
}) => {
  const isPageAvailable = pageNumber !== undefined && pageNumber !== null && pageNumber > 0;
  const [currentPage, setCurrentPage] = useState<number>(isPageAvailable ? pageNumber! : 1);
  const [copied, setCopied] = useState(false);

  // Sync state when props change
  React.useEffect(() => {
    if (pageNumber && pageNumber > 0) setCurrentPage(pageNumber);
  }, [pageNumber]);

  if (!isOpen) return null;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(exactSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalPages = document?.pageCount || (
    documentName.includes('NIT') ? 68 :
    documentName.includes('Pre_Bid') ? 16 :
    documentName.includes('Corrigendum_2') ? 6 :
    documentName.includes('Corrigendum_1') ? 4 : 3
  );

  // Document Content Renderer
  const renderDocumentContent = () => {
    // 1. If we have real extracted pages on the document
    if (document?.pages && document.pages.length > 0) {
      const targetPage = document.pages.find(p => p.pageNumber === currentPage) || document.pages[0];
      const textToHighlight = exactSnippet.trim();

      return (
        <div className="space-y-4 font-mono text-xs text-stone-800 leading-relaxed">
          <div className="text-center pb-3 border-b border-stone-200 font-sans">
            <h4 className="font-bold text-sm uppercase text-stone-900">{document.filename || document.name}</h4>
            <p className="text-[10px] text-stone-500 font-mono">
              Page {targetPage.pageNumber} of {totalPages} • Ingested via Real Parser
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded border border-stone-200 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
            {targetPage.text}
          </div>
        </div>
      );
    }

    // 2. If we have extracted raw text but not page-split
    if (document?.extractedText) {
      return (
        <div className="space-y-4 font-mono text-xs text-stone-800 leading-relaxed">
          <div className="text-center pb-3 border-b border-stone-200 font-sans">
            <h4 className="font-bold text-sm uppercase text-stone-900">{document.filename || document.name}</h4>
            <p className="text-[10px] text-stone-500 font-mono">
              Raw Extracted Document Text ({document.extractedText.length} characters)
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded border border-stone-200 whitespace-pre-wrap font-mono text-[11px] leading-relaxed max-h-[500px] overflow-y-auto">
            {document.extractedText}
          </div>
        </div>
      );
    }

    // 3. Synthetic Benchmark Corrigendum 2 Mock
    if (documentName.includes('Corrigendum_2')) {
      return (
        <div className="space-y-4 font-serif text-xs text-stone-800 leading-relaxed">
          <div className="text-center pb-3 border-b border-stone-200 font-sans">
            <h4 className="font-bold text-sm uppercase text-stone-900">INDIAN INSTITUTE OF SCIENCE EDUCATION & ADVANCED RESEARCH</h4>
            <p className="text-[11px] text-stone-500 font-mono">Central Procurement & Computing Facilities Cell</p>
            <p className="text-xs font-bold text-stone-800 mt-1 font-mono">CORRIGENDUM NO. 2 (SUBSTANTIVE AMENDMENTS)</p>
            <p className="text-[10px] text-stone-500 font-mono">Ref No: IISEAR/PROC/CC/2026/089-T04/CORR-02 • Date: 09-Aug-2026</p>
          </div>

          <p>
            With reference to Tender Enquiry No. IISEAR/PROC/CC/2026/089-T04 published on CPPP Portal on 28-Jul-2026 for the "Supply and Deployment of AI-enabled Research Computing Infrastructure", all prospective bidders are hereby advised to note the following substantive amendments approved by the Competent Purchase Committee:
          </p>

          <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded my-3">
            <h5 className="font-sans font-bold text-stone-900 text-xs">Clause C2.1: Extension of Bid Submission Schedule</h5>
            <p className="mt-1 font-mono text-[11px] text-stone-900 bg-white p-2 rounded border border-amber-200">
              <mark className="bg-yellow-200 px-1 py-0.5 font-bold">
                Bid Submission End Date is hereby EXTENDED from 12-Aug-2026 (15:00 hrs) to 19-Aug-2026 (15:00 hrs IST). Technical bid opening will take place on 20-Aug-2026 at 15:30 hrs IST.
              </mark>
            </p>
          </div>

          <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded my-3">
            <h5 className="font-sans font-bold text-stone-900 text-xs">Clause C2.2: Amendment in Financial Turnover Threshold (Eligibility Criteria 2.1)</h5>
            <p className="mt-1 font-mono text-[11px] text-stone-900 bg-white p-2 rounded border border-blue-200">
              <mark className="bg-yellow-200 px-1 py-0.5 font-bold">
                Average Annual Financial Turnover of at least INR 15.00 Crores over the last three financial years (FY 2022-23, 2023-24, 2024-25) in lieu of earlier INR 10.00 Crores. Bidders must furnish audited P&L with Practicing CA UDIN.
              </mark>
            </p>
          </div>

          <div className="p-3 bg-stone-100 rounded my-3">
            <h5 className="font-sans font-bold text-stone-900 text-xs">Clause C2.3: SLA and Replacement Spares Commitment</h5>
            <p className="mt-1 text-stone-800 text-[11px]">
              Bidder and OEM must submit a joint undertaking for 4-Hour On-Site Resolution SLA for compute nodes and critical InfiniBand network switches. Spares depot must be located within 150 km of the institute campus.
            </p>
          </div>

          <p className="text-[11px] text-stone-500 pt-3 border-t border-stone-200">
            All other terms, general conditions of contract (GCC), and arbitration clauses remain unaltered.
          </p>
        </div>
      );
    }

    if (documentName.includes('Pre_Bid')) {
      return (
        <div className="space-y-4 font-sans text-xs text-stone-800">
          <div className="text-center pb-3 border-b border-stone-200">
            <h4 className="font-bold text-sm uppercase text-stone-900">PRE-BID CLARIFICATION REPLY MATRIX</h4>
            <p className="text-[10px] text-stone-500 font-mono">Tender ID: IISEAR/PROC/CC/2026/089-T04 • Conference Date: 05-Aug-2026</p>
          </div>

          <table className="w-full text-left border-collapse border border-stone-300 text-[11px]">
            <thead className="bg-stone-100 font-mono">
              <tr>
                <th className="border border-stone-300 p-1.5 w-12">Query #</th>
                <th className="border border-stone-300 p-1.5 w-32">NIT Clause Ref</th>
                <th className="border border-stone-300 p-1.5">Query Raised by Bidder</th>
                <th className="border border-stone-300 p-1.5">Clarification / Decision of Committee</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-stone-300 p-1.5 font-mono">Query #14</td>
                <td className="border border-stone-300 p-1.5 font-mono">Sec 3.4 (RAM)</td>
                <td className="border border-stone-300 p-1.5">Can system RAM per 8-GPU node be upgraded to 1024GB DDR5 ECC for multi-tenant LLM inference workloads?</td>
                <td className="border border-stone-300 p-1.5 bg-yellow-50 font-bold">
                  <mark className="bg-yellow-200 px-1 py-0.5">
                    ACCEPTED. Tender technical specification stands revised to 1024GB (1TB) DDR5 ECC RAM per GPU node. Revised BOQ to be uploaded.
                  </mark>
                </td>
              </tr>
              <tr>
                <td className="border border-stone-300 p-1.5 font-mono">Query #22</td>
                <td className="border border-stone-300 p-1.5 font-mono">Sec 2.4 (OEM Presence)</td>
                <td className="border border-stone-300 p-1.5">Request reduction of OEM operational presence in India from 7 continuous years to 5 years.</td>
                <td className="border border-stone-300 p-1.5 bg-green-50">
                  <mark className="bg-yellow-200 px-1 py-0.5">
                    AGREED. OEM continuous commercial presence in India is relaxed to minimum 5 years.
                  </mark>
                </td>
              </tr>
              <tr>
                <td className="border border-stone-300 p-1.5 font-mono">Query #39</td>
                <td className="border border-stone-300 p-1.5 font-mono">Sec 5.2 (Make in India)</td>
                <td className="border border-stone-300 p-1.5">Is self-declaration of Class-I local content (&ge; 50%) sufficient?</td>
                <td className="border border-stone-300 p-1.5 bg-yellow-50">
                  <mark className="bg-yellow-200 px-1 py-0.5">
                    As estimated tender value exceeds INR 10.00 Crores, bidders must submit a statutory auditor certificate certifying minimum 50% local content with detailed computation breakdown.
                  </mark>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    if (documentName.includes('Revised_Financial_BOQ')) {
      return (
        <div className="space-y-3 font-mono text-xs">
          <div className="bg-stone-100 p-2.5 rounded border border-stone-300">
            <span className="font-bold text-stone-900 block">EXCEL SCHEDULE OF RATES: BOQ_REV_V2.XLSX</span>
            <span className="text-[10px] text-stone-500">Sheet: Schedule_A_Hardware_Supply</span>
          </div>

          <table className="w-full text-left border-collapse border border-stone-300 text-[11px]">
            <thead className="bg-stone-200">
              <tr>
                <th className="border border-stone-300 p-1.5">Item #</th>
                <th className="border border-stone-300 p-1.5">Item Description</th>
                <th className="border border-stone-300 p-1.5">Qty</th>
                <th className="border border-stone-300 p-1.5">Unit</th>
                <th className="border border-stone-300 p-1.5">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-blue-50">
                <td className="border border-stone-300 p-1.5 font-bold">1.01</td>
                <td className="border border-stone-300 p-1.5">AI Compute Server Node: 2x Intel Xeon Platinum, 4x NVIDIA H100 80GB SXM5, 1024 GB (1TB) DDR5 ECC RAM, 2x 3.84TB NVMe SSD.</td>
                <td className="border border-stone-300 p-1.5 font-bold">8</td>
                <td className="border border-stone-300 p-1.5">Nos</td>
                <td className="border border-stone-300 p-1.5 text-blue-800 font-bold">REVISED SPEC (1TB RAM)</td>
              </tr>
              <tr className="bg-amber-50">
                <td className="border border-stone-300 p-1.5 font-bold">2.03</td>
                <td className="border border-stone-300 p-1.5">100Gbps InfiniBand Quantum HDR Leaf/Spine Managed Switches with redundant PSU.</td>
                <td className="border border-stone-300 p-1.5 font-bold">4</td>
                <td className="border border-stone-300 p-1.5">Nos</td>
                <td className="border border-stone-300 p-1.5 text-amber-800 font-bold">QTY INCREASED (2 → 4)</td>
              </tr>
              <tr className="bg-emerald-50">
                <td className="border border-stone-300 p-1.5 font-bold">2.05</td>
                <td className="border border-stone-300 p-1.5">100G QSFP28 to QSFP28 Active Optical Cables (3m & 5m).</td>
                <td className="border border-stone-300 p-1.5 font-bold">32</td>
                <td className="border border-stone-300 p-1.5">Nos</td>
                <td className="border border-stone-300 p-1.5 text-emerald-800 font-bold">NEW LINE ITEM ADDED</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    // Default NIT fallback
    return (
      <div className="space-y-4 font-serif text-xs text-stone-800 leading-relaxed">
        <div className="text-center pb-3 border-b border-stone-200 font-sans">
          <h4 className="font-bold text-sm uppercase text-stone-900">INDIAN INSTITUTE OF SCIENCE EDUCATION & ADVANCED RESEARCH</h4>
          <p className="text-[10px] text-stone-500 font-mono">Tender Notice No: IISEAR/PROC/CC/2026/089-T04 • Date: 28-Jul-2026</p>
        </div>

        <p className="font-bold text-stone-900 font-sans text-xs">Section 2.1: Mandatory Minimum Technical Eligibility Criteria</p>
        <p>
          2.1.1 The bidder must be an established System Integrator or OEM in India having executed at least three (3) High-Performance Computing (HPC) or AI Supercomputing installations in Government institutions or PSUs during the last five years.
        </p>

        <div className="p-2.5 bg-stone-100 rounded my-2 font-mono text-[11px]">
          2.1.2 Financial Capacity: The Average Annual Financial Turnover of the bidder during the last three financial years (FY 2022-23, 2023-24, 2024-25) must not be less than INR 10.00 Crores (Ten Crores).
        </div>

        <p className="font-bold text-stone-900 font-sans text-xs mt-3">Section 4.2: Earnest Money Deposit (EMD)</p>
        <p>
          Bidders must submit Earnest Money Deposit of INR 18,50,000/- (Eighteen Lakhs Fifty Thousand only) via Bank Guarantee or RTGS. MSEs registered under UDYAM are exempt as per GFR 2017 Rule 170.
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-stone-300 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden my-4 flex flex-col h-[90vh]">
        
        {/* Header Ribbon */}
        <div className="bg-stone-900 text-stone-100 px-6 py-3.5 flex items-center justify-between border-b border-stone-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold font-mono text-white truncate max-w-md">
                  {documentName}
                </h3>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold font-mono bg-stone-800 text-blue-300 border border-stone-700">
                  {document?.provenance || 'SOURCE CITATION'}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-mono">
                Showing Page {currentPage} of {totalPages} • Grounded Citation Viewer
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopySnippet}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono transition-colors"
              title="Copy Citation Text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
              <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page & Provenance Toolbar */}
        <div className="bg-stone-100 px-6 py-2.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono flex-shrink-0">
          <div className="flex items-center space-x-2">
            {isPageAvailable ? (
              <>
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-1 rounded border border-stone-300 bg-white disabled:opacity-40 hover:bg-stone-50"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-stone-700" />
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-1 rounded border border-stone-300 bg-white disabled:opacity-40 hover:bg-stone-50"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-stone-700" />
                </button>
              </>
            ) : (
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[11px]">
                PAGE: UNKNOWN (Unpaginated / Boundary Not Found in Source)
              </span>
            )}

            {sectionNumber ? (
              <span className="text-[11px] text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                Section: {sectionNumber}
              </span>
            ) : (
              <span className="text-[11px] text-stone-400 bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
                Section: UNKNOWN
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            {extractionMethod && (
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                Method: {extractionMethod}
              </span>
            )}

            {verificationStatus === 'VERIFIED' ? (
              <span 
                role="status" 
                aria-label="Citation status: Deterministically verified against authoritative source" 
                className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>VERIFIED EVIDENCE</span>
              </span>
            ) : verificationStatus === 'FAILED_VALIDATION' ? (
              <span 
                role="status" 
                aria-label="Citation status: Validation failed, claim quarantined" 
                className="flex items-center space-x-1 px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 font-bold"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                <span>FAILED VALIDATION (QUARANTINED)</span>
              </span>
            ) : verificationStatus === 'INSUFFICIENT_EVIDENCE' ? (
              <span 
                role="status" 
                aria-label="Citation status: Insufficient evidence available" 
                className="flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>INSUFFICIENT EVIDENCE</span>
              </span>
            ) : verificationStatus === 'UNKNOWN' ? (
              <span 
                role="status" 
                aria-label="Citation status: Unknown boundary or unconfirmed" 
                className="flex items-center space-x-1 px-2 py-0.5 rounded bg-stone-200 text-stone-800 border border-stone-400 font-bold"
              >
                <span>STATUS: UNKNOWN</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-stone-600">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                <span>Provenance: {document?.provenance || 'INGESTED'}</span>
              </span>
            )}

            {document?.provenance === 'SYNTHETIC_DEMO' && (
              <span 
                role="status"
                aria-label="Provenance: Synthetic benchmark demonstration document"
                className="px-2 py-0.5 rounded bg-violet-100 text-violet-900 border border-violet-300 font-bold"
              >
                SYNTHETIC_DEMO
              </span>
            )}
          </div>
        </div>

        {/* Quarantined Citation Alert Banner */}
        {verificationStatus === 'FAILED_VALIDATION' && (
          <div className="bg-rose-50 border-b border-rose-300 px-6 py-3 flex items-start space-x-3 text-xs text-rose-900 flex-shrink-0" role="alert">
            <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-950 font-mono">DETERMINISTIC VALIDATION FAILURE: CITATION QUARANTINED</p>
              <p className="mt-0.5 text-rose-800 text-[11px] leading-relaxed">
                This cited fact or snippet could not be verified in the authoritative document text. To prevent AI hallucination or fabricated references from contaminating procurement decisions, this item is quarantined.
              </p>
            </div>
          </div>
        )}

        {/* Insufficient Evidence Warning Banner */}
        {verificationStatus === 'INSUFFICIENT_EVIDENCE' && (
          <div className="bg-amber-50 border-b border-amber-300 px-6 py-3 flex items-start space-x-3 text-xs text-amber-900 flex-shrink-0" role="alert">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950 font-mono">INCOMPLETE EVIDENCE DISCLAIMER</p>
              <p className="mt-0.5 text-amber-800 text-[11px] leading-relaxed">
                Evidence is incomplete across the retrieved document sections. Authoritative claims cannot be confirmed until full-corpus retrieval or manual review is completed.
              </p>
            </div>
          </div>
        )}

        {/* Highlighted Snippet Banner */}
        {exactSnippet && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-start space-x-2 text-xs font-mono text-amber-950 flex-shrink-0">
            <span className="font-bold uppercase text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded flex-shrink-0">
              CITED SNIPPET:
            </span>
            <p className="italic text-[11px] leading-snug font-sans text-stone-900">
              "{exactSnippet}"
            </p>
          </div>
        )}

        {/* Document Render Canvas */}
        <div className="p-8 bg-stone-100 flex-grow overflow-y-auto flex justify-center">
          <div className="bg-white border border-stone-300 rounded-sm shadow-md w-full max-w-2xl min-h-[500px] p-8">
            {renderDocumentContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-900 text-stone-400 px-6 py-2.5 border-t border-stone-800 flex items-center justify-between text-xs font-mono flex-shrink-0">
          <span>Tender: {document?.tenderId || 'Active Workspace'}</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
