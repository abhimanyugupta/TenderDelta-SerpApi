import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Check, 
  Globe, 
  ShieldAlert, 
  Clock, 
  Smartphone, 
  Mail, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { Tender } from '../types';

interface AlertsCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tender: Tender | null;
  onNavigateToTab?: (tab: string) => void;
}

export const AlertsCenterModal: React.FC<AlertsCenterModalProps> = ({
  isOpen,
  onClose,
  tender,
  onNavigateToTab
}) => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('+91 98200 12345');

  if (!isOpen || !tender) return null;

  const mockLiveAlerts = [
    {
      id: 'alt-1',
      type: 'CORRIGENDUM_DETECTED',
      portal: 'CPPP eProcure (Sample)',
      title: 'Corrigendum No. 2 Ingestion Alert',
      description: 'Material turnover requirement raised from ₹10.00 Cr to ₹15.00 Cr. Submission deadline extended by 7 days to 19-Aug-2026.',
      timeAgo: 'Demo Timestamp',
      severity: 'CRITICAL',
      unread: true
    },
    {
      id: 'alt-2',
      type: 'BOQ_REVISED',
      portal: 'CPPP eProcure (Sample)',
      title: 'Revised Financial BOQ (v2.0) Ingestion Alert',
      description: 'Line item 1.01 RAM memory doubled to 1024GB DDR5. Added Item 2.05 (32x 100G AOC Cables). Estimated BOM impact: +₹37.40 Lakhs.',
      timeAgo: 'Demo Timestamp',
      severity: 'HIGH',
      unread: false
    },
    {
      id: 'alt-3',
      type: 'PRE_BID_PUBLISHED',
      portal: 'CPPP eProcure (Sample)',
      title: 'Pre-Bid Clarification Reply Matrix Ingestion Alert',
      description: '48 queries responded. 8 queries resulted in substantive amendments. OEM India commercial presence relaxed to 5 years.',
      timeAgo: 'Demo Timestamp',
      severity: 'MEDIUM',
      unread: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-stone-300 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Bell className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-sm font-bold font-mono tracking-tight text-white">
              Corrigendum & Change Notification Architecture
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-xs font-sans">
          
          {/* Explicit Transparency Notice: NOT CONNECTED TO LIVE SCRAPER */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-start space-x-3 text-amber-900">
            <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px] leading-relaxed">
              <span className="font-bold font-mono text-[10px] uppercase tracking-wider block text-amber-950">
                [FUTURE INTEGRATION / NOT CONNECTED IN MVP]
              </span>
              <p>
                Live automated portal scraping of CPPP/GeM is not connected in this MVP. Alerts are generated when new document versions (PDF/XLSX) are uploaded into your tender workspace. The feeds below demonstrate how multi-channel notifications operate.
              </p>
            </div>
          </div>

          {/* Sample Alerts Feed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold font-mono uppercase text-stone-700 tracking-wider">
                Sample Corrigenda Alert Feed ({mockLiveAlerts.length})
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 border border-stone-200">
                [SYNTHETIC DEMO FEED]
              </span>
            </div>

            <div className="space-y-2.5">
              {mockLiveAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    alt.severity === 'CRITICAL' ? 'bg-red-50/40 border-red-200' :
                    alt.severity === 'HIGH' ? 'bg-amber-50/40 border-amber-200' :
                    'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.2 rounded text-[9px] font-bold font-mono uppercase ${
                        alt.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
                        alt.severity === 'HIGH' ? 'bg-amber-600 text-white' :
                        'bg-blue-600 text-white'
                      }`}>
                        {alt.severity}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500">{alt.portal}</span>
                    </div>

                    <span className="text-[10px] font-mono text-stone-400">{alt.timeAgo}</span>
                  </div>

                  <h4 className="font-bold text-stone-900 mt-1 text-xs">
                    {alt.title}
                  </h4>

                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                    {alt.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Channels Configuration */}
          <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
            <h3 className="text-[11px] font-bold font-mono uppercase text-stone-700 tracking-wider">
              Alert Delivery Preferences [UI Architecture]
            </h3>

            <div className="space-y-2 text-stone-700">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <Mail className="w-4 h-4 text-stone-600" />
                <span>Instant Email alerts on uploaded Corrigenda</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <Smartphone className="w-4 h-4 text-stone-600" />
                <span>In-app Desktop & Browser Push Alerts</span>
              </label>

              <div className="pt-1">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappAlerts}
                    onChange={(e) => setWhatsappAlerts(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Urgent Corrigendum Alerts (Architected for Future API)</span>
                </label>

                {whatsappAlerts && (
                  <div className="mt-2 ml-6 flex items-center space-x-2">
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+91 Mobile Number"
                      className="px-2.5 py-1 border border-stone-300 rounded font-mono text-xs max-w-xs"
                    />
                    <span className="text-[10px] text-stone-500 font-mono">[DEMO INPUT]</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-mono font-bold text-xs"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
