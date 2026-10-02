import React, { useState } from 'react';
import { Users, Shield, Lock, CheckCircle2, UserPlus, Sliders, Bell, Info } from 'lucide-react';
import { UserRoleView } from '../types';

export const TeamSettingsView: React.FC = () => {
  const [members, setMembers] = useState([
    { id: '1', name: 'Rajesh Sharma', email: 'rajesh.sharma@bidops.in', role: 'BID_MANAGER', accessLevel: 'ADMIN' },
    { id: '2', name: 'Ananya Verma', email: 'ananya.v@bidops.in', role: 'FINANCE', accessLevel: 'EDITOR' },
    { id: '3', name: 'Dr. Vikram Sen', email: 'vikram.sen@hpc-solutions.in', role: 'TECHNICAL', accessLevel: 'EDITOR' },
    { id: '4', name: 'Pooja Iyer', email: 'pooja.iyer@legalcorp.in', role: 'LEGAL_COMPLIANCE', accessLevel: 'REVIEWER' },
    { id: '5', name: 'Karthik Nair', email: 'karthik.n@bidops.in', role: 'OPERATIONS', accessLevel: 'EDITOR' },
  ]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-stone-100 text-stone-800 border border-stone-200">
            TEAM ARCHITECTURE [SAMPLE ROLES]
          </span>
          <span className="text-xs text-stone-500 font-mono">Role-Based Access Control Structure</span>
        </div>
        <h1 className="text-xl font-bold text-stone-900 mt-1 font-sans">
          Team Workspace & Review Roles
        </h1>
        <p className="text-xs text-stone-600 max-w-3xl mt-0.5">
          Demonstrates how multi-role bid management separates responsibilities across Bid Management, Finance & Accounts, Technical/Engineering, Legal/Compliance, and Operations.
        </p>
      </div>

      {/* Team Members List */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-stone-700" />
            <h2 className="text-xs font-bold text-stone-900 uppercase font-mono tracking-wider">
              Sample Bid Review Team ({members.length})
            </h2>
            <span className="text-[10px] font-mono text-stone-500">[DEMO SEATS]</span>
          </div>
        </div>

        <div className="divide-y divide-stone-200">
          {members.map((member) => (
            <div key={member.id} className="p-4 flex items-center justify-between text-xs font-sans">
              <div>
                <p className="font-bold text-stone-900">{member.name}</p>
                <p className="text-[11px] text-stone-500 font-mono">{member.email}</p>
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

      {/* Architecture Guarantees */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-4 text-xs font-sans">
        <div className="flex items-center space-x-2 border-b border-stone-200 pb-3">
          <Lock className="w-4 h-4 text-stone-700" />
          <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-stone-900">
            Confidentiality & Compliance Architectural Principles
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
            <span className="font-bold text-stone-900 font-mono block">Zero Model Training</span>
            <p className="text-stone-600 text-[11px]">User uploaded tender documents and pricing sheets are processed ephemerally and never used to train public LLMs.</p>
          </div>

          <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
            <span className="font-bold text-stone-900 font-mono block">Isolated Workspaces</span>
            <p className="text-stone-600 text-[11px]">Each tender engagement is compartmentalized with its own clause diffs, task matrix, and evidence viewers.</p>
          </div>

          <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
            <span className="font-bold text-stone-900 font-mono block">Traceable Audit Records</span>
            <p className="text-stone-600 text-[11px]">Maintains explicit records of human confirmations and status changes for governance readiness.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
