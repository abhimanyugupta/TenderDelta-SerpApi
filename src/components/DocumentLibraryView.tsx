import React, { useState, useRef } from 'react';
import { 
  FileText, 
  FileCheck, 
  Upload, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  FileSpreadsheet,
  Download,
  Clock,
  Plus,
  Info,
  Trash2,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  FileCode
} from 'lucide-react';
import { Tender, TenderDocument, DocumentType, DocumentLifecycleStatus } from '../types';
import { parseUploadedFile } from '../utils/fileExtractor';
import { executeTenderAnalysis } from '../utils/analysisEngine';
import { appendAuditEvent } from '../utils/storage';

interface DocumentLibraryViewProps {
  tender: Tender;
  onOpenSourceViewer: (docName: string, page: number, snippet: string) => void;
  onUploadNewDoc: (doc: TenderDocument) => void;
  onUpdateTender?: (updatedTender: Tender) => void;
}

export const DocumentLibraryView: React.FC<DocumentLibraryViewProps> = ({
  tender,
  onOpenSourceViewer,
  onUploadNewDoc,
  onUpdateTender
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [reanalyzeStatus, setReanalyzeStatus] = useState('');
  const [viewRawDocId, setViewRawDocId] = useState<string | null>(null);

  // Manual / file input refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    setIsProcessingFile(true);
    setProcessingStatus(`Parsing ${fileList.length} file(s)...`);

    for (const file of fileList) {
      try {
        setProcessingStatus(`Extracting text & structure from ${file.name}...`);
        const parsed = await parseUploadedFile(file);

        const newDoc: TenderDocument = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          tenderId: tender.id,
          name: parsed.filename,
          filename: parsed.filename,
          title: parsed.filename.replace(/\.[^/.]+$/, ''),
          type: parsed.fileType,
          versionNumber: (tender.documents?.length || 0) + 1,
          versionLabel: `v${(tender.documents?.length || 0) + 1}.0 (${parsed.fileType.replace(/_/g, ' ')})`,
          fileSizeBytes: parsed.fileSizeBytes,
          uploadDate: new Date().toISOString().split('T')[0],
          publicationDate: new Date().toISOString().split('T')[0],
          pageCount: parsed.pageCount,
          lifecycleStatus: 'PARSED' as DocumentLifecycleStatus,
          extractedText: parsed.extractedText,
          pages: parsed.pages,
          sections: parsed.sections,
          summary: parsed.summary,
          rawTextSummary: parsed.summary,
          sha256Hash: 'DOC-HASH-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          provenance: 'USER_UPLOADED'
        };

        onUploadNewDoc(newDoc);
      } catch (err: any) {
        console.error('File parsing error', err);
      }
    }

    setIsProcessingFile(false);
    setProcessingStatus('');
    setShowUploadModal(false);
  };

  const handleTriggerReanalysis = async () => {
    if (!onUpdateTender) return;
    setIsReanalyzing(true);
    setReanalyzeStatus('Running Version Delta Pipeline across all ingested files...');

    try {
      const result = await executeTenderAnalysis(tender, (status, pct) => {
        setReanalyzeStatus(`${status} (${pct}%)`);
      });

      let updated = {
        ...tender,
        changes: result.changes,
        requirements: result.requirements,
        boqChanges: result.boqChanges,
        conflicts: result.conflicts,
        deadlines: result.deadlines,
        tasks: result.tasks,
        riskScore: result.riskScore,
        riskScoreReason: result.riskScoreReason,
        auditTrail: result.auditTrail
      };

      updated = appendAuditEvent(
        updated,
        'REANALYSIS_EXECUTED',
        `Re-analyzed ${tender.documents.length} documents using ${result.engineUsed}`,
        'Current User',
        'BID_MANAGER',
        'ANALYSIS'
      );

      onUpdateTender(updated);
    } catch (e: any) {
      console.error('Re-analysis failed', e);
    } finally {
      setIsReanalyzing(false);
      setReanalyzeStatus('');
    }
  };

  const selectedRawDoc = tender.documents.find(d => d.id === viewRawDocId);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-blue-50 text-blue-800 border border-blue-200">
                DOCUMENT REPOSITORY
              </span>
              <span className="text-xs text-stone-500 font-mono">
                {tender.documents.length} Documents Ingested • Provenance: {tender.provenance}
              </span>
            </div>
            <h1 className="text-xl font-bold text-stone-900 mt-1 font-sans">
              Tender Document Library & Version Repository
            </h1>
            <p className="text-xs text-stone-600 max-w-3xl mt-0.5">
              All parsed original RFPs, technical specifications, Excel BOQs, and subsequent corrigenda dockets with section indexes and source text viewers.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleTriggerReanalysis}
              disabled={isReanalyzing}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-semibold font-mono transition-colors shadow-xs"
            >
              {isReanalyzing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span>{isReanalyzing ? 'Re-analyzing...' : 'Re-Run Delta Engine'}</span>
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold font-mono transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Ingest New Document</span>
            </button>
          </div>
        </div>

        {isReanalyzing && (
          <div className="mt-3 p-2.5 bg-blue-50 border border-blue-200 rounded text-xs font-mono text-blue-900 flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-700" />
            <span>{reanalyzeStatus}</span>
          </div>
        )}
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tender.documents.map((doc) => {
          const isExcel = doc.name?.endsWith('.xlsx') || doc.name?.endsWith('.xls') || doc.type === 'REVISED_BOQ' || doc.type === 'BOQ';

          return (
            <div
              key={doc.id}
              className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4 hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                    doc.type === 'ORIGINAL_NIT' ? 'bg-blue-100 text-blue-800' :
                    doc.type === 'CORRIGENDUM' ? 'bg-red-100 text-red-800' :
                    doc.type === 'REVISED_BOQ' || doc.type === 'BOQ' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-stone-100 text-stone-700'
                  }`}>
                    {doc.versionLabel || doc.type}
                  </span>

                  <div className="flex items-center space-x-1 text-[10px] font-mono text-emerald-700">
                    <FileCheck className="w-3 h-3" />
                    <span>{doc.lifecycleStatus || 'PARSED'}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-1">
                  {isExcel ? (
                    <FileSpreadsheet className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-stone-900 font-mono break-all leading-snug">
                      {doc.name || doc.filename}
                    </h3>
                    <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                      {doc.fileSizeBytes ? (doc.fileSizeBytes / 1024).toFixed(1) + ' KB' : 'Standard'} • {doc.pageCount || 1} Pages
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-stone-50 rounded border border-stone-100 text-[11px] text-stone-600 leading-relaxed font-sans max-h-20 overflow-hidden">
                  {doc.summary || doc.rawTextSummary || doc.extractedText?.substring(0, 150) || 'Extracted tender document.'}
                </div>

                <div className="text-[10px] font-mono text-stone-400 truncate flex items-center justify-between">
                  <span>Provenance: {doc.provenance || tender.provenance}</span>
                  {doc.pages && doc.pages.length > 0 && (
                    <span className="text-blue-600">{doc.pages.length} pages indexed</span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
                <button
                  onClick={() => setViewRawDocId(doc.id)}
                  className="text-stone-600 hover:text-stone-900 font-medium flex items-center space-x-1 text-[11px]"
                >
                  <Eye className="w-3 h-3" />
                  <span>Raw Text</span>
                </button>
                
                <button
                  onClick={() => onOpenSourceViewer(doc.name || doc.filename, 1, doc.name || doc.filename)}
                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 text-[11px]"
                >
                  <span>Inspect Viewer</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Raw Extracted Text Viewer Modal */}
      {selectedRawDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-stone-300 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-stone-900 text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold font-mono truncate">{selectedRawDoc.name}</h3>
              </div>
              <button onClick={() => setViewRawDocId(null)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            <div className="p-4 bg-stone-100 border-b border-stone-200 flex items-center justify-between text-xs font-mono">
              <span>{selectedRawDoc.pageCount || 1} Pages • {selectedDocTextLength(selectedRawDoc)} Characters Extracted</span>
              <span className="text-emerald-700 font-bold">Provenance: {selectedRawDoc.provenance || 'INGESTED'}</span>
            </div>

            <div className="p-4 overflow-y-auto flex-grow font-mono text-xs text-stone-800 bg-stone-50 whitespace-pre-wrap leading-relaxed">
              {selectedRawDoc.extractedText || selectedRawDoc.rawTextSummary || 'No raw text stored.'}
            </div>

            <div className="p-3 bg-stone-100 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setViewRawDocId(null)}
                className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono font-semibold rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-stone-300 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-stone-900 text-white px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono">Ingest New Tender Amendment / BOQ</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            <div className="p-5 space-y-4 text-xs font-sans">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.xlsx,.xls,.csv,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleFileUpload(e.target.files);
                }}
              />

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files) handleFileUpload(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-blue-500 rounded-lg p-6 text-center cursor-pointer bg-stone-50 transition-colors"
              >
                <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-semibold text-stone-800 text-sm">
                  Click to select or drag & drop files
                </p>
                <p className="text-stone-500 text-[11px] mt-1 font-mono">
                  Accepts PDF, Excel (.xlsx, .xls), CSV, Word (.docx), Plain Text
                </p>
              </div>

              {isProcessingFile && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded flex items-center space-x-2 text-blue-900 font-mono">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-700" />
                  <span>{processingStatus}</span>
                </div>
              )}

              <div className="pt-2 border-t border-stone-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded text-stone-700 hover:bg-stone-50 font-mono"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

function selectedDocTextLength(doc: TenderDocument): number {
  return (doc.extractedText?.length || doc.rawTextSummary?.length || 0);
}
