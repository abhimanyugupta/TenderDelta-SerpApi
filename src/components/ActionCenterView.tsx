import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Plus, 
  Calendar, 
  ArrowRight, 
  ExternalLink,
  Filter,
  Check,
  AlertTriangle,
  Scale
} from 'lucide-react';
import { Tender, ActionTask, UserRoleView, RequirementCategory } from '../types';
import { deriveTaskDueDateFromDeadline, INDIAN_PROCUREMENT_SLA_RULES } from '../utils/slaPolicy';

interface ActionCenterViewProps {
  tender: Tender;
  activeRole: UserRoleView;
  onUpdateTaskStatus: (taskId: string, newStatus: any) => void;
  onAddTask: (task: Omit<ActionTask, 'id' | 'createdAt'>) => void;
  onOpenSourceViewer: (
    docName: string, 
    page?: number | null, 
    snippet?: string,
    extractionMethod?: any,
    verificationStatus?: any,
    sectionNumber?: string | null
  ) => void;
}

export const ActionCenterView: React.FC<ActionCenterViewProps> = ({
  tender,
  activeRole,
  onUpdateTaskStatus,
  onAddTask,
  onOpenSourceViewer
}) => {
  const [filterRole, setFilterRole] = useState<UserRoleView | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // Derive initial task due date from tender's actual submission deadline
  const initialDueDate = deriveTaskDueDateFromDeadline(
    tender.currentSubmissionDeadline,
    'DEFAULT'
  ).dueDateDisplay;

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newRole, setNewRole] = useState<UserRoleView>('BID_MANAGER');
  const [newAssignee, setNewAssignee] = useState('');
  const [newDueDate, setNewDueDate] = useState(initialDueDate);
  const [newPriority, setNewPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');

  // When role changes in modal, dynamically recommend SLA policy deadline
  useEffect(() => {
    const categoryMap: Partial<Record<UserRoleView, RequirementCategory>> = {
      FINANCE: 'TURNOVER',
      LEGAL_COMPLIANCE: 'LOCAL_CONTENT',
      TECHNICAL: 'TECHNICAL',
      OPERATIONS: 'WARRANTY',
      BID_MANAGER: 'DEADLINE'
    };
    const cat = categoryMap[newRole] || 'DEFAULT';
    const derived = deriveTaskDueDateFromDeadline(tender.currentSubmissionDeadline, cat);
    if (derived.dueDateDisplay && derived.dueDateDisplay !== 'Pending Submission Deadline') {
      setNewDueDate(derived.dueDateDisplay);
    }
  }, [newRole, tender.currentSubmissionDeadline]);

  const filteredTasks = tender.tasks.filter(task => {
    if (filterRole !== 'ALL' && task.role !== filterRole) return false;
    if (filterStatus !== 'ALL' && task.status !== filterStatus) return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const derived = deriveTaskDueDateFromDeadline(tender.currentSubmissionDeadline, 'DEFAULT');

    onAddTask({
      title: newTitle.trim(),
      description: newDesc.trim() || newTitle.trim(),
      assignedTo: newAssignee.trim() || 'Bid Coordinator',
      role: newRole,
      priority: newPriority,
      status: 'OPEN',
      dueDate: newDueDate || derived.dueDateDisplay,
      slaPolicyRule: derived.slaPolicyRule,
      daysBeforeDeadline: derived.daysBeforeDeadline,
      isStaleDeadline: derived.isStaleDeadline,
      staleWarning: derived.staleWarning,
      changeIdRef: 'manual'
    });

    setNewTitle('');
    setNewDesc('');
    setShowNewTaskModal(false);
  };

  const openCount = tender.tasks.filter(t => t.status === 'OPEN').length;
  const inProgressCount = tender.tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completedCount = tender.tasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-5 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-indigo-50 text-indigo-800 border border-indigo-200">
                ACTION EXECUTION CENTER
              </span>
              <span className="text-xs text-stone-500 font-mono">
                Auto-generated from Corrigenda & Amendments
              </span>
            </div>
            <h1 className="text-xl font-bold text-stone-900 mt-1 font-sans">
              Bidder Compliance & Action Tasks
            </h1>
            <p className="text-xs text-stone-600 max-w-3xl mt-0.5">
              Ensure no amendment is missed in the bid submission. Every task is linked to its triggering corrigendum clause with clear team ownership.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold font-mono transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Action Task</span>
            </button>
          </div>
        </div>

        {/* Tender Submission Deadline Anchor */}
        <div className="mt-4 p-3 bg-stone-50 border border-stone-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center space-x-2.5">
            <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <div>
              <span className="text-stone-500 text-[11px] block">TENDER SUBMISSION DEADLINE ANCHOR:</span>
              <span className="font-bold text-stone-900 text-sm">
                {tender.currentSubmissionDeadline || 'UNKNOWN / NOT PARSED'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-stone-600 bg-white px-3 py-1.5 rounded border border-stone-200">
            <Scale className="w-3.5 h-3.5 text-stone-500" />
            <span>Indian Public Procurement SLA Policy Active (Dynamic Lead Times)</span>
          </div>
        </div>

        {/* Task Metric Ribbon */}
        <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-3 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded bg-stone-50 border border-stone-200">
            <span className="text-[10px] text-stone-500 block uppercase">Total Tasks</span>
            <span className="text-base font-bold text-stone-900">{tender.tasks.length}</span>
          </div>

          <div className="p-2.5 rounded bg-red-50/60 border border-red-200">
            <span className="text-[10px] text-red-600 block uppercase">Open Tasks</span>
            <span className="text-base font-bold text-red-700">{openCount}</span>
          </div>

          <div className="p-2.5 rounded bg-amber-50/60 border border-amber-200">
            <span className="text-[10px] text-amber-700 block uppercase">In Progress</span>
            <span className="text-base font-bold text-amber-800">{inProgressCount}</span>
          </div>

          <div className="p-2.5 rounded bg-emerald-50/60 border border-emerald-200">
            <span className="text-[10px] text-emerald-700 block uppercase">Completed</span>
            <span className="text-base font-bold text-emerald-800">{completedCount}</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-stone-500">Filter By Role:</span>
          {['ALL', 'BID_MANAGER', 'FINANCE', 'TECHNICAL', 'LEGAL_COMPLIANCE', 'OPERATIONS'].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r as any)}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterRole === r
                  ? 'bg-stone-900 text-white font-bold'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isCritical = task.priority === 'CRITICAL';
          const isHigh = task.priority === 'HIGH';

          return (
            <div
              key={task.id}
              className={`bg-white border rounded-lg p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                task.status === 'COMPLETED' ? 'opacity-70 bg-stone-50/60 border-stone-200' : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* Task Left */}
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.2 rounded text-[10px] font-bold font-mono uppercase ${
                    isCritical ? 'bg-red-100 text-red-800' :
                    isHigh ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {task.priority} Priority
                  </span>

                  <span className="px-2 py-0.2 rounded text-[10px] font-semibold font-mono bg-stone-100 text-stone-700">
                    {task.role}
                  </span>

                  <span className="text-[11px] font-mono text-stone-500">
                    Due: <strong className="text-stone-800">{task.dueDate}</strong>
                  </span>

                  {task.slaPolicyRule && (
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
                      SLA: {task.daysBeforeDeadline !== undefined ? `T-${task.daysBeforeDeadline}d` : 'Rule-derived'}
                    </span>
                  )}

                  {task.isStaleDeadline && (
                    <span className="flex items-center space-x-1 px-2 py-0.2 rounded text-[10px] font-bold font-mono bg-red-100 text-red-800 border border-red-300">
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                      <span>STALE DEADLINE</span>
                    </span>
                  )}
                </div>

                <h3 className={`text-sm font-bold ${task.status === 'COMPLETED' ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                  {task.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {task.description}
                </p>

                {task.isStaleDeadline && task.staleWarning && (
                  <div className="p-2 rounded bg-red-50/80 border border-red-200 text-xs text-red-800 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{task.staleWarning}</span>
                  </div>
                )}

                {task.slaPolicyRule && (
                  <div className="text-[11px] font-mono text-stone-500 bg-stone-50 px-2 py-1 rounded border border-stone-200">
                    <span className="text-stone-400">SLA Policy: </span>{task.slaPolicyRule}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-stone-500 pt-1">
                  <span className="flex items-center space-x-1">
                    <User className="w-3 h-3 text-stone-400" />
                    <span>Assignee: <strong className="text-stone-700">{task.assignedTo}</strong></span>
                  </span>

                  {task.sourceCitation && (
                    <button
                      onClick={() => onOpenSourceViewer(
                        task.sourceCitation!.documentName,
                        task.sourceCitation!.pageNumber ?? null,
                        task.sourceCitation!.exactSnippet,
                        undefined,
                        undefined,
                        task.sourceCitation!.sectionNumber
                      )}
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Source: {task.sourceCitation.documentName} (p.{task.sourceCitation.pageNumber !== undefined && task.sourceCitation.pageNumber !== null ? task.sourceCitation.pageNumber : 'UNKNOWN'})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Task Right Actions */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <select
                  value={task.status}
                  onChange={(e) => onUpdateTaskStatus(task.id, e.target.value)}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold border transition-colors ${
                    task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                    task.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                    'bg-red-50 text-red-800 border-red-300'
                  }`}
                >
                  <option value="OPEN">Status: OPEN</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="BLOCKED">BLOCKED</option>
                </select>

                {task.status !== 'COMPLETED' && (
                  <button
                    onClick={() => onUpdateTaskStatus(task.id, 'COMPLETED')}
                    className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    title="Mark Complete"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-stone-300 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-stone-900 text-white px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono">Create New Compliance Action Task</h3>
              <button onClick={() => setShowNewTaskModal(false)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-3.5 text-xs font-sans">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Task Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Obtain revised CA UDIN certificate for ₹15 Cr turnover"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Detailed Description</label>
                <textarea
                  rows={2}
                  placeholder="Specific actions, documents to collect, contact details..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Role Lens</label>
                  <select
                    value={newRole}
                    onChange={(e: any) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded font-mono bg-white"
                  >
                    <option value="BID_MANAGER">Bid Manager</option>
                    <option value="FINANCE">Finance</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="LEGAL_COMPLIANCE">Legal / Compliance</option>
                    <option value="OPERATIONS">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded font-mono bg-white"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Assignee Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Bid Finance Officer"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold font-mono"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
