import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle,
  Building2,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Tender, UserRoleView } from '../types';

interface GroundedChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tender: Tender | null;
  activeRole: UserRoleView;
  onOpenSourceViewer: (
    docName: string, 
    page?: number | null, 
    snippet?: string,
    extractionMethod?: any,
    verificationStatus?: any,
    sectionNumber?: string | null
  ) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: Array<{
    documentId?: string;
    sourceDocumentId?: string;
    sourceVersion?: string;
    documentName: string;
    pageNumber?: number | null;
    pageOrNull?: number | null;
    sectionNumber?: string | null;
    sectionOrNull?: string | null;
    exactSnippet: string;
    extractionMethod?: any;
    verificationStatus?: any;
    verificationReason?: string;
    isVerifiedAgainstSource?: boolean;
    isQuarantined?: boolean;
  }>;
  hasConflict?: boolean;
  isNotFound?: boolean;
  groundedInTender?: boolean;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  verificationStatus?: string;
  insufficientEvidence?: boolean;
  retrievalCoverage?: any;
}

export const GroundedChatDrawer: React.FC<GroundedChatDrawerProps> = ({
  isOpen,
  onClose,
  tender,
  activeRole,
  onOpenSourceViewer
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: tender 
        ? `Ask about "${tender.title}" using its ${tender.documents.length} uploaded documents. Review answers against their source quotations; AI interpretations require human review.`
        : 'Hello! Please select or analyze a tender to query its version history and requirement changes.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  if (!isOpen) return null;

  const sampleQuestions = [
    'What is the revised turnover criteria and what changed?',
    'Has the submission deadline changed?',
    'What are the key BOQ changes in v2?',
    'What are the Make in India local content rules?',
    'Are there any unresolved clause conflicts?'
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || !tender) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/tender-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend.trim(),
          tenderTitle: tender.title,
          tenderOrg: tender.organization,
          roleFilter: activeRole,
          activeTenderContext: {
            id: tender.id,
            provenance: tender.provenance,
            analysisMode: tender.analysisMode,
            documents: tender.documents || [],
            changes: tender.changes || [],
            deadlines: tender.deadlines || [],
            conflicts: tender.conflicts || [],
            requirements: (tender.requirements || []).slice(0, 15)
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error('Tender answer endpoint unavailable.');
      const isNotFound = data.insufficientEvidence || 
                         data.verificationStatus === 'INSUFFICIENT_EVIDENCE' || 
                         (data.answer || '').toUpperCase().includes('NOT FOUND IN PROVIDED DOCUMENTS');

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'Response generated from active tender.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || [],
        hasConflict: data.hasConflict,
        isNotFound,
        groundedInTender: data.groundedInTender,
        confidence: data.confidence,
        verificationStatus: data.verificationStatus,
        insufficientEvidence: data.insufficientEvidence,
        retrievalCoverage: data.retrievalCoverage
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: 'The answer service is unavailable. No verified answer was produced. Inspect the uploaded source documents and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: [],
        verificationStatus: 'UNVERIFIED',
        insufficientEvidence: true,
        groundedInTender: false
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-300">
          
          {/* Header */}
          <div className="bg-stone-900 text-stone-100 p-4 border-b border-stone-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                AI
              </div>
              <div>
                <h2 className="text-xs font-bold font-mono tracking-tight text-white flex items-center space-x-1.5">
                  <span>Grounded Tender Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </h2>
                <p className="text-[10px] text-stone-400 font-mono truncate max-w-[240px]">
                  {tender ? tender.referenceNumber : 'No Active Tender'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Defense Banner */}
          <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 text-[10px] font-mono text-stone-600 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Strict Citation Guard Active</span>
            </div>
            <span>No Unsubstantiated Claims</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 text-xs font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-lg p-3 leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-stone-50 border border-stone-200 text-stone-900 rounded-bl-none'
                  }`}
                >
                  {msg.sender === 'assistant' && (msg.isNotFound || msg.groundedInTender === false || msg.insufficientEvidence) && (
                    <div className="mb-2 px-2 py-1 bg-amber-50 border border-amber-200 rounded text-[10px] font-mono text-amber-800 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span className="font-bold">INSUFFICIENT EVIDENCE / ABSENCE IN SEARCHED TEXT</span>
                    </div>
                  )}

                  <p>{msg.text}</p>

                  {/* Citations Box */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-stone-200/80 space-y-1.5 text-[11px] font-mono">
                      <span className="text-[10px] font-bold text-stone-600 block uppercase">
                        Evidence Citations:
                      </span>
                      {msg.citations.map((c, idx) => {
                        const pageVal = c.pageNumber ?? c.pageOrNull;
                        const pageLabel = pageVal !== undefined && pageVal !== null && pageVal > 0 ? `p.${pageVal}` : 'p.UNKNOWN';
                        const isVerified = c.verificationStatus === 'VERIFIED' || c.isVerifiedAgainstSource;
                        const isQuarantined = c.verificationStatus === 'FAILED_VALIDATION' || c.isQuarantined;

                        return (
                          <div key={idx} className={`p-1.5 rounded border space-y-0.5 ${isQuarantined ? 'bg-rose-50 border-rose-200' : 'bg-white border-stone-200'}`}>
                            <div className="flex items-center justify-between font-bold text-stone-900">
                              <span className="truncate max-w-[180px]">{c.documentName}</span>
                              <div className="flex items-center space-x-1">
                                {isVerified ? (
                                  <span className="text-[9px] px-1 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">VERIFIED</span>
                                ) : isQuarantined ? (
                                  <span className="text-[9px] px-1 py-0.2 bg-rose-100 text-rose-800 rounded font-bold">QUARANTINED</span>
                                ) : (
                                  <span className="text-[9px] px-1 py-0.2 bg-stone-100 text-stone-600 rounded">UNVERIFIED</span>
                                )}
                                <button
                                  onClick={() => onOpenSourceViewer(
                                    c.documentName, 
                                    pageVal, 
                                    c.exactSnippet, 
                                    c.extractionMethod || 'DETERMINISTIC_PARSER', 
                                    c.verificationStatus || (isVerified ? 'VERIFIED' : 'UNVERIFIED'), 
                                    c.sectionNumber ?? c.sectionOrNull
                                  )}
                                  className="text-blue-600 hover:text-blue-800 flex items-center text-[10px] ml-1"
                                >
                                  <span>{pageLabel}</span>
                                  <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                                </button>
                              </div>
                            </div>
                            <p className="font-serif italic text-stone-700 text-[10px]">
                              "{c.exactSnippet}"
                            </p>
                            {c.verificationReason && isQuarantined && (
                              <p className="text-[9px] font-mono text-rose-700">
                                Reason: {c.verificationReason}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <span className={`text-[9px] block mt-1 font-mono ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-stone-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-xs font-mono text-stone-500 bg-stone-50 p-2.5 rounded border border-stone-200 max-w-[80%]">
                <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Grounding against tender documents...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="p-2 border-t border-stone-200 bg-stone-50 flex items-center space-x-1.5 overflow-x-auto scrollbar-none flex-shrink-0 text-[11px] font-mono">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded bg-white border border-stone-200 hover:border-stone-400 text-stone-700 text-[10px] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-stone-200 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder={tender ? "Ask about any clause or change..." : "Select a tender first..."}
                value={inputQuery}
                disabled={!tender || loading}
                onChange={(e) => setInputQuery(e.target.value)}
                className="flex-grow px-3 py-2 border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
              />
              <button
                type="submit"
                disabled={!tender || !inputQuery.trim() || loading}
                className="px-3 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded text-xs font-bold font-mono transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
