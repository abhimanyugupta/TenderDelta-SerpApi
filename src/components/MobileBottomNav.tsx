import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileDiff, 
  CheckSquare, 
  FolderOpen, 
  MoreHorizontal,
  GitBranch,
  Table,
  FileSpreadsheet,
  AlertTriangle,
  FileText,
  Users,
  Scale
} from 'lucide-react';
import { UserRoleView } from '../types';

interface MobileBottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  openCount: number;
  criticalChangesCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
  openCount,
  criticalChangesCount
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'changes', label: 'Changes', icon: FileDiff, badge: criticalChangesCount > 0 ? criticalChangesCount : undefined },
    { id: 'actions', label: 'Actions', icon: CheckSquare, badge: openCount > 0 ? openCount : undefined },
    { id: 'documents', label: 'Docs', icon: FolderOpen },
  ];

  const moreTabs = [
    { id: 'timeline', label: 'Version Timeline', icon: GitBranch },
    { id: 'requirements', label: 'Requirement Matrix', icon: Table },
    { id: 'boq', label: 'BOQ Delta & Pricing', icon: FileSpreadsheet },
    { id: 'conflicts', label: 'Clause Conflict Scanner', icon: AlertTriangle },
    { id: 'summary', label: 'Executive Brief (PDF)', icon: FileText },
    { id: 'audit', label: 'Decision Audit Trail', icon: Users },
    { id: 'methodology', label: 'Procurement Rubric', icon: Scale },
  ];

  return (
    <>
      {/* More Menu Backdrop Modal on Mobile */}
      {showMoreMenu && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setShowMoreMenu(false)}
        >
          <div 
            className="fixed bottom-16 inset-x-0 bg-white border-t border-stone-300 rounded-t-2xl p-5 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="font-bold text-xs font-mono uppercase text-stone-900">
                Additional Modules
              </span>
              <button 
                onClick={() => setShowMoreMenu(false)}
                className="text-stone-500 text-xs font-mono"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              {moreTabs.map((item) => {
                const Icon = item.icon;
                const isSelected = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setShowMoreMenu(false);
                    }}
                    className={`flex items-center space-x-2.5 p-3 rounded-lg border text-left transition-colors ${
                      isSelected 
                        ? 'bg-stone-900 text-white border-stone-900' 
                        : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-semibold truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation Bar (Visible on Mobile & Tablet, hidden on md and up) */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-stone-900 text-stone-300 border-t border-stone-800 md:hidden flex items-center justify-around py-2 px-1 shadow-lg">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setShowMoreMenu(false);
                onTabChange(tab.id);
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded transition-colors relative ${
                isActive ? 'text-white font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-stone-400'}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold font-mono bg-red-600 text-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-mono">{tab.label}</span>
            </button>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded transition-colors ${
            showMoreMenu || moreTabs.some(t => t.id === currentTab) ? 'text-white font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 text-stone-400" />
          <span className="text-[10px] mt-1 font-mono">More</span>
        </button>
      </nav>
    </>
  );
};
