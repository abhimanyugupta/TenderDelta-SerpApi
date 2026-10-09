import React from 'react';
import { Lock, Users } from 'lucide-react';

const sampleRoles = [
  { id: 'seat-1', role: 'BID_MANAGER', accessLevel: 'ADMIN' },
  { id: 'seat-2', role: 'FINANCE', accessLevel: 'EDITOR' },
  { id: 'seat-3', role: 'TECHNICAL', accessLevel: 'EDITOR' },
  { id: 'seat-4', role: 'LEGAL_COMPLIANCE', accessLevel: 'REVIEWER' },
  { id: 'seat-5', role: 'OPERATIONS', accessLevel: 'EDITOR' },
];

export const TeamSettingsView: React.FC = () => (
  <div className="space-y-6 pb-12">
    <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-stone-100 text-stone-800 border border-stone-200">
          ILLUSTRATIVE ROLES · NO ACCOUNTS PROVISIONED
        </span>
      </div>
      <h1 className="text-xl font-bold text-stone-900 mt-1 font-sans">
        Team Workspace & Review Roles
      </h1>
      <p className="text-xs text-stone-600 max-w-3xl mt-0.5">
        Example reviewer roles for bid management, finance, technical review, legal compliance, and operations. This prototype does not authenticate users or enforce these roles.
      </p>
    </div>

    <div className="bg-white border border-stone-200 rounded-lg shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-stone-700" />
          <h2 className="text-xs font-bold text-stone-900 uppercase font-mono tracking-wider">
            Sample Role Seats ({sampleRoles.length})
          </h2>
          <span className="text-[10px] font-mono text-stone-500">[DEMO ONLY]</span>
        </div>
      </div>

      <div className="divide-y divide-stone-200">
        {sampleRoles.map((member, index) => (
          <div key={member.id} className="p-4 flex items-center justify-between text-xs font-sans">
            <div>
              <p className="font-bold text-stone-900">Sample seat {String(index + 1).padStart(2, '0')}</p>
              <p className="text-[11px] text-stone-500 font-mono">No user identity or email is configured</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-stone-100 text-stone-800 border border-stone-200">
                {member.role}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-blue-50 text-blue-800 border border-blue-200">
                {member.accessLevel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-4 text-xs font-sans">
      <div className="flex items-center space-x-2 border-b border-stone-200 pb-3">
        <Lock className="w-4 h-4 text-stone-700" />
        <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-stone-900">
          Prototype Boundaries
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
          <span className="font-bold text-stone-900 font-mono block">Model Provider</span>
          <p className="text-stone-600 text-[11px]">When Gemini is configured, document text sent for analysis is processed by that provider. Review its current terms before using real procurement material.</p>
        </div>
        <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
          <span className="font-bold text-stone-900 font-mono block">Access Control</span>
          <p className="text-stone-600 text-[11px]">This prototype has no sign-in, server-enforced roles, or tenant isolation. Do not treat the role labels as permissions.</p>
        </div>
        <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
          <span className="font-bold text-stone-900 font-mono block">Review History</span>
          <p className="text-stone-600 text-[11px]">Review state is prototype application data, not an immutable audit log or compliance record.</p>
        </div>
      </div>
    </div>
  </div>
);
