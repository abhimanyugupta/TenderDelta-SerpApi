import React, { useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  User, 
  ChevronDown,
  Download,
  SlidersHorizontal
} from 'lucide-react';
import { Tender, StructuredRequirement, UserRoleView } from '../types';

interface RequirementMatrixViewProps {
  tender: Tender;
  activeRole: UserRoleView;
  onOpenSourceViewer: (docName: string, page: number, snippet: string) => void;
  onUpdateRequirementStatus: (id: string, newStatus: any) => void;
}

export const RequirementMatrixView: React.FC<RequirementMatrixViewProps> = ({
  tender,
  activeRole,
  onOpenSourceViewer,
  onUpdateRequirementStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [changedOnly, setChangedOnly] = useState(false);

  const categories = Array.from(new Set(tender.requirements.map(r => r.category)));

  const filteredRequirements = tender.requirements.filter(req => {
    if (selectedCategory !== 'ALL' && req.category !== selectedCategory) return false;
    if (selectedStatus !== 'ALL' && req.status !== selectedStatus) return false;
    if (changedOnly && !req.isChanged) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = req.title.toLowerCase().includes(q);
      const matchKey = req.key.toLowerCase().includes(q);
      const matchOrig = req.originalValue.toLowerCase().includes(q);
      const matchCurr = req.currentValue.toLowerCase().includes(q);
      if (!matchTitle && !matchKey && !matchOrig && !matchCurr) return false;
    }
    return true;
  });

  const exportCsv = () => {
    const headers = ['Category', 'Key', 'Title', 'Original (v1.0)', 'Current (Latest)', 'Changed?', 'Status', 'Risk', 'Owner', 'Source Doc', 'Page'];
    const rows = filteredRequirements.map(r => [
      `"${r.category}"`,
      `"${r.key}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.originalValue.replace(/"/g, '""')}"`,
      `"${r.currentValue.replace(/"/g, '""')}"`,
      r.isChanged ? 'YES' : 'NO',
      r.status,
      r.riskLevel,
      `"${r.owner}"`,
      `"${r.latestCitation.documentName}"`,
      r.latestCitation.pageNumber
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${tender.referenceNumber}_Requirement_Matrix.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                REQUIREMENT GRAPH MATRIX
              </span>
              <span className="text-xs text-stone-500 font-mono">
                Live Dynamic State • {tender.requirements.length} Structured Clauses
              </span>
            </div>
            <h1 className="text-xl font-bold text-stone-900 mt-1 font-sans">
              Bidder Compliance & Requirement Matrix
            </h1>
            <p className="text-xs text-stone-600 max-w-3xl mt-0.5">
              Side-by-side traceability of original RFP specifications against the latest binding amendments. Track compliance, assigned owners, and statutory citations.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={exportCsv}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold font-mono transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Matrix (CSV)</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-3">
          
          {/* Changed Only Toggle */}
          <button
            onClick={() => setChangedOnly(!changedOnly)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-colors flex items-center space-x-1.5 ${
              changedOnly 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${changedOnly ? 'bg-white' : 'bg-blue-600'}`}></span>
            <span>Show Changed Only ({tender.requirements.filter(r => r.isChanged).length})</span>
          </button>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs border border-stone-300 rounded font-mono bg-white text-stone-800"
          >
            <option value="ALL">All Categories ({categories.length})</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs border border-stone-300 rounded font-mono bg-white text-stone-800"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLIANT">Compliant</option>
            <option value="ACTION_REQUIRED">Action Required</option>
            <option value="AT_RISK">At Risk</option>
            <option value="NOT_APPLICABLE">Not Applicable</option>
          </select>

          {/* Search Box */}
          <div className="relative flex-grow max-w-xs ml-auto">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clause or key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>

        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead className="bg-stone-900 text-stone-200 font-mono text-[11px] uppercase tracking-wider border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">Category / Key</th>
                <th className="py-3 px-4">Requirement Title</th>
                <th className="py-3 px-4">Original (v1.0)</th>
                <th className="py-3 px-4">Current Binding (Latest)</th>
                <th className="py-3 px-3 text-center">Changed?</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Owner</th>
                <th className="py-3 px-4">Citation Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredRequirements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-500 font-mono">
                    No requirements match your current filters.
                  </td>
                </tr>
              ) : (
                filteredRequirements.map((req) => {
                  return (
                    <tr 
                      key={req.id} 
                      className={`hover:bg-stone-50/80 transition-colors ${
                        req.isChanged ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* Category & Key */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-bold text-stone-900 font-mono block">{req.key}</span>
                        <span className="text-[10px] text-stone-500 font-mono">{req.category}</span>
                      </td>

                      {/* Title */}
                      <td className="py-3.5 px-4 align-top max-w-xs">
                        <span className="font-semibold text-stone-900 block">{req.title}</span>
                        {req.riskLevel === 'CRITICAL' && (
                          <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-bold font-mono bg-red-100 text-red-800">
                            CRITICAL RISK
                          </span>
                        )}
                      </td>

                      {/* Original Value */}
                      <td className="py-3.5 px-4 align-top font-mono text-[11px] text-stone-600 max-w-[180px]">
                        <span className="line-through block text-stone-500">{req.originalValue}</span>
                      </td>

                      {/* Current Value */}
                      <td className="py-3.5 px-4 align-top font-mono text-xs max-w-[220px]">
                        <span className={`font-bold block ${req.isChanged ? 'text-blue-900' : 'text-stone-900'}`}>
                          {req.currentValue}
                        </span>
                      </td>

                      {/* Changed Badge */}
                      <td className="py-3.5 px-3 align-top text-center">
                        {req.isChanged ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-100 text-amber-900 border border-amber-300">
                            YES (Δ)
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-stone-400">
                            No
                          </span>
                        )}
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-3 align-top">
                        <select
                          value={req.status}
                          onChange={(e) => onUpdateRequirementStatus(req.id, e.target.value)}
                          className={`px-2 py-1 rounded text-[11px] font-mono font-bold border ${
                            req.status === 'COMPLIANT' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                            req.status === 'ACTION_REQUIRED' ? 'bg-red-50 text-red-800 border-red-300' :
                            req.status === 'AT_RISK' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                            'bg-stone-100 text-stone-700 border-stone-300'
                          }`}
                        >
                          <option value="COMPLIANT">Compliant</option>
                          <option value="ACTION_REQUIRED">Action Required</option>
                          <option value="AT_RISK">At Risk</option>
                          <option value="NOT_APPLICABLE">Not Applicable</option>
                        </select>
                      </td>

                      {/* Owner */}
                      <td className="py-3.5 px-3 align-top font-mono text-[11px] text-stone-700">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3 text-stone-400 flex-shrink-0" />
                          <span className="truncate max-w-[100px]">{req.owner}</span>
                        </div>
                      </td>

                      {/* Citation Evidence */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="text-[11px] font-mono text-stone-600">
                          <span className="block truncate max-w-[180px] text-stone-800 font-medium">
                            {req.latestCitation.documentName}
                          </span>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="text-stone-500">p.{req.latestCitation.pageNumber}</span>
                            <button
                              onClick={() => onOpenSourceViewer(
                                req.latestCitation.documentName,
                                req.latestCitation.pageNumber,
                                req.latestCitation.exactSnippet
                              )}
                              className="text-blue-600 hover:text-blue-800 font-bold flex items-center"
                            >
                              <span>View</span>
                              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
