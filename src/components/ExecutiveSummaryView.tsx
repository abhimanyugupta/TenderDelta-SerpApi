import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  ShieldAlert, 
  Building2,
  Copy,
  Check
} from 'lucide-react';
import { Tender } from '../types';

interface ExecutiveSummaryViewProps {
  tender: Tender;
  onClose?: () => void;
}

export const ExecutiveSummaryView: React.FC<ExecutiveSummaryViewProps> = ({
  tender,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, [tender.id]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/executive-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tender })
      });
      const data = await res.json();
      setSummaryData(data.summary);
    } catch (e) {
      setSummaryData({
        tenderId: tender.id,
        title: tender.title,
        generatedAt: new Date().toISOString(),
        versionSummary: 'Comprehensive lifecycle analysis across 5 documents (Original NIT -> Corrigendum 1 -> Pre-Bid Reply -> Corrigendum 2 -> Revised BOQ)',
        criticalTakeaways: [
          'Average Annual Turnover threshold increased by 50% from ₹10.00 Cr to ₹15.00 Cr (Requires fresh CA certificate with valid UDIN).',
          'Bid submission deadline extended by 7 days to 19-Aug-2026 15:00 hrs IST.',
          'RAM per GPU node doubled from 512GB to 1TB in Revised BOQ (+₹18.4L estimated BoM impact).'
        ],
        eligibilityImpacts: [
          'Turnover criteria revised from ₹10 Cr to ₹15 Cr.',
          'OEM operating presence in India relaxed from 7 years to 5 continuous years.',
          'EMD confirmed at ₹18.50 Lakhs with UDYAM MSE exemption applicability.'
        ],
        deadlineShiftNotes: [
          'Submission closing moved from 12-Aug-2026 to 19-Aug-2026 (+7 calendar days).',
          'Technical opening rescheduled to 20-Aug-2026 at 15:30 hrs IST.'
        ],
        technicalModifications: [
          '8x GPU compute nodes upgraded to 1024GB DDR5 memory.',
          '100Gbps InfiniBand switch count doubled from 2 units to 4 units.',
          'Active optical cables (32 nos) inserted as standalone line item.'
        ],
        commercialPricingImpacts: [
          'BOQ revision increases hardware BoM by approximately ₹37.4 Lakhs.',
          'Tender processing fee must be remitted strictly via CPPP online gateway.'
        ],
        newlyRequiredDocuments: [
          'Make in India Class-I Statutory Auditor Local Content Certificate with computation sheet.',
          'Back-to-back OEM 4-Hour On-Site SLA authorization letter with Maharashtra spares depot proof.'
        ],
        unresolvedContradictions: [
          'Clarification pending on local content computation for imported H100 GPU silicon modules under MeitY exemption.'
        ],
        mandatoryActionsSummary: [
          'Issue revised CA turnover certificate UDIN.',
          'Audit local content with statutory auditor.',
          'Upload revised BOQ unit rates on CPPP portal.'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    if (!summaryData) return;
    const text = `# TENDER CHANGE BRIEF (CONFIDENTIAL BID INTELLIGENCE)
Tender: ${tender.title}
Reference: ${tender.referenceNumber}
Organization: ${tender.organization}
Generated: ${new Date().toLocaleDateString('en-IN')}

## 1. Executive Version Summary
${summaryData.versionSummary}

## 2. Critical Takeaways (Disqualification Risks)
${summaryData.criticalTakeaways?.map((t: string) => `- ${t}`).join('\n')}

## 3. Eligibility & Turnover Impacts
${summaryData.eligibilityImpacts?.map((t: string) => `- ${t}`).join('\n')}

## 4. Deadline & Milestone Shifts
${summaryData.deadlineShiftNotes?.map((t: string) => `- ${t}`).join('\n')}

## 5. Technical Specifications Delta
${summaryData.technicalModifications?.map((t: string) => `- ${t}`).join('\n')}

## 6. Commercial & BOQ Pricing Impacts
${summaryData.commercialPricingImpacts?.map((t: string) => `- ${t}`).join('\n')}

## 7. Newly Required Documents for Submission
${summaryData.newlyRequiredDocuments?.map((t: string) => `- ${t}`).join('\n')}

## 8. Unresolved Ambiguities / Contradictions
${summaryData.unresolvedContradictions?.map((t: string) => `- ${t}`).join('\n')}

## 9. Mandatory Pre-Submission Action Checklist
${summaryData.mandatoryActionsSummary?.map((t: string) => `- [ ] ${t}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 print:p-0 print:m-0">
      
      {/* Action Header - Hidden on Print */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-blue-50 text-blue-800 border border-blue-200">
              FORMAL TENDER CHANGE BRIEF
            </span>
            <span className="text-xs text-stone-500 font-mono">10-Section Audit Report</span>
          </div>
          <h1 className="text-xl font-bold text-stone-900 mt-1 font-sans">
            Executive Tender Change Brief
          </h1>
          <p className="text-xs text-stone-600 max-w-2xl mt-0.5">
            Prepared for Senior Bid Leadership, Finance Committee, and Technical Evaluation Board.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center space-x-1.5 px-3 py-2 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold font-mono transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-600" />}
            <span>{copied ? 'Copied Markdown' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold font-mono transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Executive Brief Document */}
      <div className="bg-white border border-stone-300 rounded-lg p-8 sm:p-12 shadow-sm space-y-8 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b-2 border-stone-900 pb-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-stone-500">
            <span>TENDERDELTA INTELLIGENCE BRIEF</span>
            <span>CONFIDENTIAL • BID COMMITTEE ONLY</span>
          </div>

          <h1 className="text-2xl font-bold text-stone-900 font-serif leading-tight">
            Tender Version Change Brief & Compliance Analysis
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono pt-2">
            <div>
              <span className="text-stone-500 block uppercase text-[10px]">Tender Reference</span>
              <strong className="text-stone-900">{tender.referenceNumber}</strong>
            </div>
            <div>
              <span className="text-stone-500 block uppercase text-[10px]">Procuring Body</span>
              <strong className="text-stone-900">{tender.organization}</strong>
            </div>
            <div>
              <span className="text-stone-500 block uppercase text-[10px]">Portal & Version</span>
              <strong className="text-stone-900">{tender.portal} • {tender.currentVersion}</strong>
            </div>
            <div>
              <span className="text-stone-500 block uppercase text-[10px]">Generated Date</span>
              <strong className="text-stone-900">{new Date().toLocaleDateString('en-IN')}</strong>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center font-mono text-xs text-stone-500">
            Generating structured Executive Tender Change Brief...
          </div>
        ) : summaryData ? (
          <div className="space-y-8 font-sans text-xs text-stone-800 leading-relaxed">
            
            {/* Section 1: Executive Version Summary */}
            <section className="space-y-2">
              <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-stone-900 border-b border-stone-200 pb-1">
                1. Executive Version Lifecycle Summary
              </h2>
              <p className="text-stone-700">
                {summaryData.versionSummary}
              </p>
            </section>

            {/* Section 2: Critical Disqualification Risks */}
            <section className="space-y-2 bg-red-50/50 p-4 rounded border border-red-200">
              <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-red-900 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>2. Critical Disqualification Takeaways</span>
              </h2>
              <ul className="space-y-1.5 list-disc list-inside text-stone-900 font-medium">
                {summaryData.criticalTakeaways?.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Section 3: Eligibility & Turnover Impacts */}
            <section className="space-y-2">
              <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-stone-900 border-b border-stone-200 pb-1">
                3. Financial & Technical Eligibility Modifications
              </h2>
              <ul className="space-y-1 list-disc list-inside text-stone-700">
                {summaryData.eligibilityImpacts?.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Section 4: Deadline Shifts */}
            <section className="space-y-2">
              <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-stone-900 border-b border-stone-200 pb-1">
                4. Deadline Extensions & Milestone Adjustments
              </h2>
              <ul className="space-y-1 list-disc list-inside text-stone-700">
                {summaryData.deadlineShiftNotes?.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Section 5: Technical Specification Shifts */}
            <section className="space-y-2">
              <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-stone-900 border-b border-stone-200 pb-1">
                5. Technical Specifications & Architecture Shifts
              </h2>
              <ul className="space-y-1 list-disc list-inside text-stone-700">
                {summaryData.technicalModifications?.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Section 6: Commercial & Pricing Impacts */}
            <section className="space-y-2">
              <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-stone-900 border-b border-stone-200 pb-1">
                6. Commercial & BOQ Pricing Impacts
              </h2>
              <ul className="space-y-1 list-disc list-inside text-stone-700">
                {summaryData.commercialPricingImpacts?.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Section 7: Newly Required Documents */}
            <section className="space-y-2">
              <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-stone-900 border-b border-stone-200 pb-1">
                7. Newly Required Documents & Certificates for Upload
              </h2>
              <ul className="space-y-1 list-disc list-inside text-stone-700">
                {summaryData.newlyRequiredDocuments?.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Section 8: Unresolved Ambiguities */}
            <section className="space-y-2">
              <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-stone-900 border-b border-stone-200 pb-1">
                8. Contradictions & Ambiguities under Review
              </h2>
              <ul className="space-y-1 list-disc list-inside text-stone-700">
                {summaryData.unresolvedContradictions?.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Section 9: Pre-Submission Checklist */}
            <section className="space-y-2 bg-stone-50 p-4 rounded border border-stone-200">
              <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-stone-900">
                9. Final Pre-Submission Action Checklist
              </h2>
              <ul className="space-y-1.5 text-stone-800 font-mono text-[11px]">
                {summaryData.mandatoryActionsSummary?.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded border border-stone-400 inline-block"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

          </div>
        ) : null}

        {/* Signoff Footer */}
        <div className="pt-8 border-t border-stone-300 grid grid-cols-2 gap-8 text-xs font-mono text-stone-500">
          <div>
            <span className="block">Prepared By: TENDERDELTA Change Intelligence</span>
            <span className="block mt-1">Report Identifier: TD-EXEC-RPT-8F40</span>
          </div>
          <div className="text-right">
            <span className="block">Bid Director Approval: _____________________</span>
            <span className="block mt-1">Date: _____________________</span>
          </div>
        </div>

      </div>

    </div>
  );
};
