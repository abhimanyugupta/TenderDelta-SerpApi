import React from 'react';
import { 
  FileDiff, 
  Layers, 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  FileText, 
  HelpCircle, 
  Users, 
  Sparkles, 
  PlusCircle, 
  SlidersHorizontal,
  ChevronDown,
  Building2,
  Calendar,
  ShieldCheck,
  Download,
  Share2,
  Bell,
  CreditCard,
  History,
  Search
} from 'lucide-react';
import { Tender, UserRoleView } from '../types';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  activeTender: Tender | null;
  allTenders: Tender[];
  onSelectTender: (tender: Tender) => void;
  onOpenNewTender: () => void;
  activeRole: UserRoleView;
  onRoleChange: (role: UserRoleView) => void;
  onToggleAiChat: () => void;
  isAiChatOpen: boolean;
  onOpenExportSummary: () => void;
  onOpenShareReport?: () => void;
  onOpenSubscription?: () => void;
  onOpenAlerts?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  activeTender,
  allTenders,
  onSelectTender,
  onOpenNewTender,
  activeRole,
  onRoleChange,
  onToggleAiChat,
  isAiChatOpen,
  onOpenExportSummary,
  onOpenShareReport,
  onOpenSubscription,
  onOpenAlerts
}) => {
  const [tenderMenuOpen, setTenderMenuOpen] = React.useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  const roleLabels: Record<UserRoleView, string> = {
    ALL: 'All Roles (Overview)',
    BID_MANAGER: 'Bid Manager',
    FINANCE: 'Finance & Accounts',
    TECHNICAL: 'Technical & Engineering',
    LEGAL_COMPLIANCE: 'Legal & Compliance',
    OPERATIONS: 'Operations & SLA'
  };

  return (
    <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-30 shadow-md">
      {/* Top Banner / Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button 
              id="nav-brand-btn"
              onClick={() => onTabChange('dashboard')}
              className="flex items-center space-x-2.5 focus:outline-none group text-left"
            >
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-black tracking-tighter text-white text-base shadow-sm group-hover:bg-blue-500 transition-colors">
                TD
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold tracking-tight text-white text-base font-mono">TENDERDELTA</span>
                  <span className="text-[10px] uppercase font-semibold bg-stone-800 text-blue-400 border border-blue-900/50 px-1.5 py-0.2 rounded font-mono">
                    CPPP / GeM
                  </span>
                </div>
                <div className="text-[10px] text-stone-400 font-medium tracking-wide uppercase hidden sm:block">
                  Tender Version Intelligence
                </div>
              </div>
            </button>

            {/* Active Tender Selector Dropdown */}
            {activeTender && (
              <div className="relative hidden md:block">
                <button
                  id="active-tender-selector-btn"
                  onClick={() => setTenderMenuOpen(!tenderMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded bg-stone-800/90 hover:bg-stone-800 border border-stone-700/80 text-xs text-stone-200 transition-all max-w-sm"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <div className="truncate text-left font-mono">
                    <span className="font-semibold text-white truncate block max-w-[200px]">{activeTender.organization}</span>
                    <span className="text-[10px] text-stone-400 truncate block max-w-[200px]">{activeTender.referenceNumber}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 ml-1" />
                </button>

                {tenderMenuOpen && (
                  <div className="absolute left-0 mt-1 w-96 rounded-md bg-stone-900 border border-stone-700 shadow-2xl z-50 py-1.5">
                    <div className="px-3 py-1.5 border-b border-stone-800 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      Switch Active Tender
                    </div>
                    {allTenders.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          onSelectTender(t);
                          setTenderMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs hover:bg-stone-800 transition-colors flex items-start justify-between ${
                          t.id === activeTender.id ? 'bg-stone-800/80 text-blue-300 font-medium' : 'text-stone-300'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="font-semibold truncate text-white">{t.title}</p>
                          <p className="text-[10px] text-stone-400 font-mono">{t.referenceNumber} • {t.organization}</p>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase flex-shrink-0 ${
                          t.riskScore === 'CRITICAL' ? 'bg-red-950/80 text-red-400 border border-red-800' :
                          t.riskScore === 'HIGH' ? 'bg-amber-950/80 text-amber-400 border border-amber-800' :
                          'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        }`}>
                          {t.riskScore}
                        </span>
                      </button>
                    ))}
                    <div className="p-2 border-t border-stone-800 mt-1">
                      <button
                        onClick={() => {
                          setTenderMenuOpen(false);
                          onOpenNewTender();
                        }}
                        className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-medium transition-colors"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add New Tender</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2">
            
            {/* Role Filter Selector */}
            <div className="relative hidden sm:block">
              <button
                id="role-filter-dropdown-btn"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-xs bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700"
              >
                <SlidersHorizontal className="w-3 h-3 text-stone-400" />
                <span className="hidden lg:inline text-stone-400">Role:</span>
                <span className="font-semibold text-white font-mono">{roleLabels[activeRole]}</span>
                <ChevronDown className="w-3 h-3 text-stone-400 ml-0.5" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-1 w-56 rounded bg-stone-900 border border-stone-700 shadow-xl z-50 py-1 font-mono text-xs">
                  <div className="px-3 py-1 text-[10px] text-stone-400 uppercase tracking-wider border-b border-stone-800">
                    Filter by Responsibilities
                  </div>
                  {(Object.keys(roleLabels) as UserRoleView[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        onRoleChange(role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-stone-800 transition-colors flex items-center justify-between ${
                        activeRole === role ? 'bg-stone-800 text-blue-400 font-semibold' : 'text-stone-300'
                      }`}
                    >
                      <span>{roleLabels[role]}</span>
                      {activeRole === role && <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Portal Alerts Watcher */}
            {onOpenAlerts && (
              <button
                id="navbar-alerts-btn"
                onClick={onOpenAlerts}
                className="p-1.5 rounded text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-750 border border-stone-700 relative transition-colors"
                title="Corrigendum Notification Feeds [Demo Feed]"
              >
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500"></span>
              </button>
            )}

            {/* Share / Consultant Export Link */}
            {onOpenShareReport && activeTender && (
              <button
                id="navbar-share-report-btn"
                onClick={onOpenShareReport}
                className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
                title="Share & Print Client Tender Brief"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden md:inline">Share / Export</span>
              </button>
            )}

            {/* Subscription & Quota Badge */}
            {onOpenSubscription && (
              <button
                id="navbar-subscription-btn"
                onClick={onOpenSubscription}
                className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded text-[11px] font-mono font-semibold bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700 transition-colors"
                title="Workspace Capacity & Plans"
              >
                <CreditCard className="w-3 h-3 text-stone-400" />
                <span className="text-emerald-400">Evaluation Plan</span>
              </button>
            )}

            {/* AI Assistant Grounded Drawer Trigger */}
            <button
              id="ai-tender-assistant-btn"
              onClick={onToggleAiChat}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                isAiChatOpen 
                  ? 'bg-blue-600 text-white shadow-inner' 
                  : 'bg-stone-800 hover:bg-stone-750 text-blue-300 border border-blue-900/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Grounded Q&A</span>
              <span className="sm:hidden">AI</span>
              {activeTender && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            {/* Add New Tender Button */}
            <button
              id="navbar-new-tender-btn"
              onClick={onOpenNewTender}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Tender</span>
            </button>
          </div>
        </div>

        {/* Secondary Navigation Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto py-1 border-t border-stone-800/80 scrollbar-none text-xs">
          
          <button
            id="tab-discovery-btn"
            onClick={() => onTabChange('discovery')}
            className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              currentTab === 'discovery'
                ? 'bg-stone-800 text-white font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>Discover Tenders</span>
          </button>

          <button
            id="tab-dashboard-btn"
            onClick={() => onTabChange('dashboard')}
            className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              currentTab === 'dashboard'
                ? 'bg-stone-800 text-white font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          {activeTender && (
            <>
              <button
                id="tab-changes-btn"
                onClick={() => onTabChange('changes')}
                className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
                  currentTab === 'changes'
                    ? 'bg-stone-800 text-white font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                }`}
              >
                <FileDiff className="w-3.5 h-3.5 text-blue-400" />
                <span>Change Intelligence</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-950 text-blue-300 font-mono font-bold border border-blue-800">
                  {activeTender.changes.length}
                </span>
              </button>

              <button
                id="tab-timeline-btn"
                onClick={() => onTabChange('timeline')}
                className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
                  currentTab === 'timeline'
                    ? 'bg-stone-800 text-white font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Corrigendum Timeline</span>
              </button>

              <button
                id="tab-requirements-btn"
                onClick={() => onTabChange('requirements')}
                className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
                  currentTab === 'requirements'
                    ? 'bg-stone-800 text-white font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Requirement Matrix</span>
              </button>

              <button
                id="tab-actions-btn"
                onClick={() => onTabChange('actions')}
                className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
                  currentTab === 'actions'
                    ? 'bg-stone-800 text-white font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Action Center</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-red-950 text-red-300 font-mono font-bold border border-red-800">
                  {activeTender.tasks.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length}
                </span>
              </button>

              <button
                id="tab-boq-btn"
                onClick={() => onTabChange('boq')}
                className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
                  currentTab === 'boq'
                    ? 'bg-stone-800 text-white font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                }`}
              >
                <span className="font-mono font-bold text-amber-300 text-xs">₹</span>
                <span>BOQ Delta Analyzer</span>
              </button>

              <button
                id="tab-conflicts-btn"
                onClick={() => onTabChange('conflicts')}
                className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
                  currentTab === 'conflicts'
                    ? 'bg-stone-800 text-white font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Conflicts & Ambiguities</span>
                {activeTender.conflicts.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-950 text-amber-300 font-mono font-bold border border-amber-800">
                    {activeTender.conflicts.length}
                  </span>
                )}
              </button>

              <button
                id="tab-documents-btn"
                onClick={() => onTabChange('documents')}
                className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
                  currentTab === 'documents'
                    ? 'bg-stone-800 text-white font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Document Library</span>
                <span className="ml-1 text-[10px] text-stone-400 font-mono">({activeTender.documents.length})</span>
              </button>

              <button
                id="tab-audit-btn"
                onClick={() => onTabChange('audit')}
                className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
                  currentTab === 'audit'
                    ? 'bg-stone-800 text-white font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                }`}
              >
                <History className="w-3.5 h-3.5 text-purple-400" />
                <span>Audit Trail</span>
              </button>
            </>
          )}

          <div className="flex-grow"></div>

          <button
            id="tab-methodology-btn"
            onClick={() => onTabChange('methodology')}
            className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              currentTab === 'methodology'
                ? 'bg-stone-800 text-white font-semibold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>GFR & Methodology</span>
          </button>

          <button
            id="tab-team-btn"
            onClick={() => onTabChange('team')}
            className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              currentTab === 'team'
                ? 'bg-stone-800 text-white font-semibold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team / Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
