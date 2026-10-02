import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  Filter, 
  Lock,
  Calendar,
  Check,
  Info
} from 'lucide-react';
import { Tender, MaterialChange } from '../types';

interface AuditTrailViewProps {
  tender: Tender;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: 'CHANGE_CONFIRMED' | 'CHANGE_FLAGGED' | 'REQUIREMENT_COMPLIANT' | 'TASK_ASSIGNED' | 'DOCUMENT_INGESTED' | 'BRIEF_EXPORTED';
  details: string;
  clauseRef?: string;
  logSignature?: string;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ tender }) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');

  // Sample recorded audit history for the tender lifecycle
  const [logs, setLogs] = useState<AuditLogEntry[]>([
    {
      id: 'audit-01',
      timestamp: '2026-08-10 16:45:12 IST',
      user: 'P. Sharma (Finance Lead)',
      role: 'FINANCE',
      action: 'CHANGE_CONFIRMED',
      details: 'Confirmed 50% Turnover increase (₹10 Cr to ₹15 Cr). Instructed accounting team to issue fresh UDIN certificate.',
      clauseRef: 'NIT Sec 3.1 & Corrigendum 2',
      logSignature: 'AUDIT-SIG-884C'
    },
    {
      id: 'audit-02',
      timestamp: '2026-08-10 17:15:30 IST',
      user: 'Dr. Vikram Sen (HPC Architect)',
      role: 'TECHNICAL',
      action: 'TASK_ASSIGNED',
      details: 'Allocated BoM review task: Server RAM doubled to 1024GB DDR5 ECC memory.',
      clauseRef: 'Schedule A Item 1.01',
      logSignature: 'AUDIT-SIG-0471'
    },
    {
      id: 'audit-03',
      timestamp: '2026-08-10 18:02:44 IST',
      user: 'Pooja Iyer (Legal & Contracts)',
      role: 'LEGAL_COMPLIANCE',
      action: 'CHANGE_CONFIRMED',
      details: 'Verified relaxation of OEM operating presence in India from 7 continuous years to 5 years per Pre-Bid Query #12.',
      clauseRef: 'Sec 4.8 / Query #12',
      logSignature: 'AUDIT-SIG-1FC6'
    },
    {
      id: 'audit-04',
      timestamp: '2026-08-11 09:30:15 IST',
      user: 'Rajesh Sharma (Bid Director)',
      role: 'BID_MANAGER',
      action: 'DOCUMENT_INGESTED',
      details: 'Ingested and parsed "Revised_Financial_BOQ_v2.xlsx" (3 line items updated).',
      clauseRef: 'Revised_Financial_BOQ_v2.xlsx',
      logSignature: 'AUDIT-SIG-942B'
    },
    {
      id: 'audit-05',
      timestamp: '2026-08-11 11:20:00 IST',
      user: 'Rajesh Sharma (Bid Director)',
      role: 'BID_MANAGER',
      action: 'BRIEF_EXPORTED',
      details: 'Generated formal 10-Section Executive Tender Change Brief for Steering Committee approval.',
      clauseRef: 'Tender Docket v5.0',
      logSignature: 'AUDIT-SIG-2B73'
    }
  ]);

  const filteredLogs = logs.filter(log => {
    if (filterAction !== 'ALL' && log.action !== filterAction) return false;
    return true;
  });

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Timestamp,User,Role,Action,Details,Clause Ref,Record Identifier"]
        .concat(logs.map(e => `"${e.timestamp}","${e.user}","${e.role}","${e.action}","${e.details}","${e.clauseRef}","${e.logSignature || ''}"`))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tender_decision_log_${tender.referenceNumber.replace(/[\/\\:]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-purple-50 text-purple-800 border border-purple-200">
                AUDIT TRAIL [SAMPLE LOG]
              </span>
              <span className="text-xs text-stone-500 font-mono">
                Human Review & Decision History
              </span>
            </div>
            <h1 className="text-xl font-bold text-stone-900 mt-1 font-sans">
              Reviewer Decision & Verification Audit Trail
            </h1>
            <p className="text-xs text-stone-600 max-w-3xl mt-0.5">
              Logs human reviews, clause confirmations, task assignments, and brief exports to maintain organizational transparency and pre-bid audit readiness.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold font-mono transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Trail (CSV)</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-stone-500">Filter By Decision Type:</span>
          {['ALL', 'CHANGE_CONFIRMED', 'TASK_ASSIGNED', 'DOCUMENT_INGESTED', 'BRIEF_EXPORTED'].map((act) => (
            <button
              key={act}
              onClick={() => setFilterAction(act)}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterAction === act
                  ? 'bg-stone-900 text-white font-bold'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {act.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Timeline */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-stone-600" />
            <h3 className="text-xs font-bold text-stone-900 font-mono uppercase tracking-wider">
              Recorded Review Decisions ({filteredLogs.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-stone-500">[In-Memory Session Trail]</span>
        </div>

        <div className="divide-y divide-stone-200">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-5 hover:bg-stone-50/60 transition-colors space-y-2 text-xs font-sans">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                    log.action === 'CHANGE_CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                    log.action === 'TASK_ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                    log.action === 'DOCUMENT_INGESTED' ? 'bg-amber-100 text-amber-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {log.action.replace('_', ' ')}
                  </span>

                  <span className="font-bold text-stone-900">{log.user}</span>
                  <span className="text-stone-400 font-mono text-[11px]">({log.role})</span>
                </div>

                <span className="text-stone-500 font-mono text-[11px] flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>{log.timestamp}</span>
                </span>
              </div>

              <p className="text-stone-800 text-[11px] leading-relaxed pl-1">
                {log.details}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-stone-100 text-[10px] font-mono text-stone-400">
                <span>Target Clause: <strong className="text-stone-700">{log.clauseRef}</strong></span>
                <span>Record ID: {log.logSignature}</span>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Compliance Note */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-xs font-sans text-stone-600 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-stone-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold font-mono text-stone-900 block text-xs">
            Review Verification Log Note
          </span>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Maintaining a structured decision record assists bid teams during pre-bid meetings and internal governance reviews. Always verify final bid submissions against official gazetted dockets from the procurement portal.
          </p>
        </div>
      </div>

    </div>
  );
};
