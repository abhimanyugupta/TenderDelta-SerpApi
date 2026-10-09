import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Building2, 
  Users, 
  Sparkles, 
  FileText, 
  Briefcase, 
  HelpCircle,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  tenderCount?: number;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentPlan = 'Free',
  tenderCount = 1
}) => {
  if (!isOpen) return null;

  const tiers = [
    {
      id: 'free',
      name: 'Free (Starter)',
      tagline: 'For evaluating single live bids and small RFPs',
      price: '₹0',
      period: 'forever',
      badge: 'Current Plan',
      isCurrent: true,
      limits: [
        '1 Active Tender Workspace',
        'Up to 3 Ingested Documents / Corrigenda',
        'Standard Clause Diff Engine',
        'Basic Requirement Extraction',
        'Standard Change Brief Export (PDF)'
      ],
      disabledFeatures: [
        'Multi-corrigendum cross-conflict scanning',
        'BOQ Excel formula & BOM price delta calculator',
        'Multi-user role sign-offs & audit trail',
        'CPPP / GeM portal change watcher'
      ]
    },
    {
      id: 'solo',
      name: 'Solo Bid Consultant',
      tagline: 'For independent bid managers & government sales advisors',
      price: '₹3,499',
      period: '/ month',
      popular: false,
      limits: [
        '5 Active Tender Workspaces',
        'Unlimited Documents & Corrigenda per tender',
        'Side-by-side Word Diffing & Exact Citations',
        'Client-Branded Tender Change Brief Exports',
        'BOQ Line Item Delta & Pricing Estimator',
        'Cross-document Conflict Engine',
        'Grounding AI Tender Assistant'
      ],
      disabledFeatures: [
        'Team multi-seat role collaboration',
        'Statutory audit export certificate'
      ]
    },
    {
      id: 'professional',
      name: 'Professional / PSU Bid Team',
      tagline: 'For defense, infrastructure, and IT contracting firms',
      price: '₹9,999',
      period: '/ month',
      popular: true,
      limits: [
        'Unlimited Active Tender Workspaces',
        'Unlimited Documents, Drawings & BOQs',
        '5 Team Reviewer Seats (Bid Manager, Finance, Tech, Legal, Ops)',
        'Full Audit Trail & Human Decision Logging',
        'Automated Action Task Allocation & Due Date Alerts',
        'Export to Excel Matrix & Word Brief',
        'Priority Grounded Processing Engine'
      ],
      disabledFeatures: [
        'Custom SSO & Dedicated On-Premises Isolation'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise / EPC Tier',
      tagline: 'For major contractors managing 50+ concurrent PSU tenders',
      price: 'Custom',
      period: 'annually',
      popular: false,
      limits: [
        'Unlimited Enterprise Seats & Role Workspaces',
        'Historical Tender Archive & Bid Win Pattern Memory',
        'Custom ERP / SAP / CRM Bid Pipeline Integration',
        'Dedicated Statutory Compliance Model Tuning',
        'Custom SLA & 24/7 Priority Support Desk',
        'Enterprise Single Sign-On (SAML / Okta / Azure AD)'
      ],
      disabledFeatures: []
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-stone-300 rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-stone-900 text-white px-6 py-5 flex items-center justify-between border-b border-stone-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-blue-900 text-blue-200 border border-blue-700">
                PLANS & CAPACITIES
              </span>
              <span className="text-xs font-mono text-stone-400">
                [UI ARCHITECTURE / BILLING NOT CONNECTED IN MVP]
              </span>
            </div>
            <h2 className="text-lg font-bold font-sans text-white mt-1">
              TENDERDELTA Tier & Capability Structure
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Active Quota Status Notice */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                {tenderCount}
              </div>
              <div>
                <span className="font-bold text-stone-900 block">Workspace Mode: Evaluation Tier</span>
                <span className="text-stone-600">Active Workspaces: {tenderCount} loaded in session</span>
              </div>
            </div>

            <div className="text-stone-500 text-[11px] self-start sm:self-auto flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-stone-400" />
              <span>Full features unlocked for evaluation in this MVP build</span>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-xl border p-5 flex flex-col justify-between transition-all relative ${
                  tier.popular 
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 shadow-md' 
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-600 text-white shadow-xs">
                    TEAM RECOMMENDED
                  </span>
                )}

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 font-sans">{tier.name}</h3>
                    <p className="text-[11px] text-stone-500 font-sans mt-0.5 leading-snug">{tier.tagline}</p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-baseline space-x-1">
                    <span className="text-xl font-bold font-mono text-stone-900">{tier.price}</span>
                    <span className="text-[11px] text-stone-500 font-mono">{tier.period}</span>
                  </div>

                  {/* Included features */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <span className="text-[10px] font-bold font-mono uppercase text-stone-600 block">
                      Target Capabilities:
                    </span>
                    <ul className="space-y-1.5 text-[11px] text-stone-700">
                      {tier.limits.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Disabled features */}
                  {tier.disabledFeatures.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-stone-100 opacity-60">
                      <ul className="space-y-1 text-[10px] text-stone-400 font-mono">
                        {tier.disabledFeatures.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <span className="text-stone-300">✕</span>
                            <span className="line-through">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-5 mt-4 border-t border-stone-100">
                  <button
                    onClick={onClose}
                    className={`w-full py-2 rounded font-bold font-mono text-xs transition-colors shadow-xs ${
                      tier.isCurrent
                        ? 'bg-stone-100 text-stone-600 border border-stone-300'
                        : 'bg-stone-900 hover:bg-stone-800 text-white'
                    }`}
                  >
                    {tier.isCurrent ? 'Current Session' : 'Plan Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Prototype boundary */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-xs font-sans text-stone-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-stone-600 flex-shrink-0" />
              <span>Prototype only: these plan cards describe intended capabilities. Billing, contractual confidentiality, regional storage, and provider data terms are not configured here.</span>
            </div>
            <span className="font-mono text-[11px] text-stone-500 whitespace-nowrap">[NOT A SERVICE OFFER]</span>
          </div>

        </div>

      </div>
    </div>
  );
};
