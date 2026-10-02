import { ActionTask, RequirementCategory, Tender, UserRoleView, GroundedCitation } from '../types';

export interface SLAPolicyRule {
  category: RequirementCategory | 'DEFAULT';
  daysBeforeDeadline: number;
  hoursBeforeDeadline?: number;
  policyDescription: string;
  defaultRole: UserRoleView;
}

/**
 * Standard Indian Public Procurement SLA Policy Rules
 * Quantifies lead times needed for compliance artifacts before portal submission cut-off.
 */
export const INDIAN_PROCUREMENT_SLA_RULES: Record<string, SLAPolicyRule> = {
  TURNOVER: {
    category: 'TURNOVER',
    daysBeforeDeadline: 4,
    policyDescription: 'Statutory CA Audited Statements & UDIN generation require minimum 4 days before bid submission.',
    defaultRole: 'FINANCE'
  },
  EMD: {
    category: 'EMD',
    daysBeforeDeadline: 3,
    policyDescription: 'Bank Guarantee / SFMS transmission or e-PBG stamp verification requires 3 working days.',
    defaultRole: 'FINANCE'
  },
  LOCAL_CONTENT: {
    category: 'LOCAL_CONTENT',
    daysBeforeDeadline: 3,
    policyDescription: 'Make in India Class-I local content auditor verification and percentage calculation requires 3 days.',
    defaultRole: 'LEGAL_COMPLIANCE'
  },
  TECHNICAL: {
    category: 'TECHNICAL',
    daysBeforeDeadline: 2,
    policyDescription: 'OEM Authorization Form (MAF) and technical parameter sheet sign-off requires 2 days.',
    defaultRole: 'TECHNICAL'
  },
  WARRANTY: {
    category: 'WARRANTY',
    daysBeforeDeadline: 2,
    policyDescription: 'Joint OEM-Bidder Undertaking for on-site spares depot & MTTR commitment requires 2 days.',
    defaultRole: 'OPERATIONS'
  },
  BOQ: {
    category: 'BOQ',
    daysBeforeDeadline: 1,
    policyDescription: 'Management rate approval, GST verification, and macro-enabled BOQ dry run requires 1 day.',
    defaultRole: 'FINANCE'
  },
  DEADLINE: {
    category: 'DEADLINE',
    daysBeforeDeadline: 0,
    hoursBeforeDeadline: 4,
    policyDescription: 'Final portal bid encryption and DSC token upload must be completed 4 hours prior to avoid portal lockout.',
    defaultRole: 'BID_MANAGER'
  },
  DEFAULT: {
    category: 'DEFAULT',
    daysBeforeDeadline: 2,
    policyDescription: 'Standard compliance review lead time (2 days prior to submission cut-off).',
    defaultRole: 'BID_MANAGER'
  }
};

/**
 * Parses an ISO date or Indian format date into a valid JavaScript Date object
 */
export function parseTenderDate(dateStr?: string): Date | null {
  if (!dateStr || dateStr.trim() === '') return null;

  // Try standard ISO/Date parse
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed;

  // Try parsing Indian format: e.g. "19-Aug-2026 15:00" or "19/08/2026"
  const clean = dateStr.trim();
  const dmyMatch = /^(\d{1,2})[-/ ]([A-Za-z0-9]{3,9})[-/ ](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/.exec(clean);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const monthStr = dmyMatch[2].toLowerCase();
    const year = parseInt(dmyMatch[3], 10);
    const hours = dmyMatch[4] ? parseInt(dmyMatch[4], 10) : 15;
    const mins = dmyMatch[5] ? parseInt(dmyMatch[5], 10) : 0;

    const monthMap: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };

    let month = monthMap[monthStr.substring(0, 3)];
    if (month === undefined && !isNaN(parseInt(monthStr, 10))) {
      month = parseInt(monthStr, 10) - 1;
    }

    if (month !== undefined) {
      const d = new Date(Date.UTC(year, month, day, hours, mins));
      if (!isNaN(d.getTime())) return d;
    }
  }

  return null;
}

/**
 * Derives a task due date from the tender's actual submission deadline and category SLA policy.
 */
export function deriveTaskDueDateFromDeadline(
  submissionDeadlineStr: string | undefined,
  category: RequirementCategory | 'DEFAULT',
  referenceNow: Date = new Date()
): {
  dueDateIso: string;
  dueDateDisplay: string;
  slaPolicyRule: string;
  daysBeforeDeadline: number;
  isStaleDeadline: boolean;
  staleWarning?: string;
} {
  const rule = INDIAN_PROCUREMENT_SLA_RULES[category] || INDIAN_PROCUREMENT_SLA_RULES.DEFAULT;
  const deadlineDate = parseTenderDate(submissionDeadlineStr);

  // If no deadline is available in tender, use policy fallback with explicit note
  if (!deadlineDate) {
    return {
      dueDateIso: 'PENDING_SUBMISSION_DEADLINE',
      dueDateDisplay: 'Pending Submission Deadline',
      slaPolicyRule: rule.policyDescription,
      daysBeforeDeadline: rule.daysBeforeDeadline,
      isStaleDeadline: false,
      staleWarning: 'Tender submission deadline is unparsed. Task date will be anchored upon Corrigendum/NIT date extraction.'
    };
  }

  // Check if tender deadline is already in the past (Stale Deadline)
  const isPast = deadlineDate.getTime() < referenceNow.getTime();
  let staleWarning: string | undefined;

  if (isPast) {
    const overdueDays = Math.ceil((referenceNow.getTime() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24));
    staleWarning = `Tender submission deadline (${deadlineDate.toLocaleDateString()}) passed ${overdueDays} day(s) ago. Task is stale pending extension corrigendum.`;
  }

  // Calculate target task due date
  const taskDate = new Date(deadlineDate.getTime());
  if (rule.hoursBeforeDeadline) {
    taskDate.setHours(taskDate.getHours() - rule.hoursBeforeDeadline);
  } else {
    taskDate.setDate(taskDate.getDate() - rule.daysBeforeDeadline);
  }

  const yyyy = taskDate.getFullYear();
  const mm = String(taskDate.getMonth() + 1).padStart(2, '0');
  const dd = String(taskDate.getDate()).padStart(2, '0');
  const dueDateDisplay = `${yyyy}-${mm}-${dd}`;

  return {
    dueDateIso: taskDate.toISOString(),
    dueDateDisplay,
    slaPolicyRule: rule.policyDescription,
    daysBeforeDeadline: rule.daysBeforeDeadline,
    isStaleDeadline: isPast,
    staleWarning
  };
}

/**
 * Creates or refreshes a compliance action task anchored to the tender's actual deadline
 */
export function createSlaGroundedTask(
  params: {
    tenderId: string;
    changeId?: string;
    title: string;
    description: string;
    category: RequirementCategory;
    role?: UserRoleView;
    assignedTo?: string;
    priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    sourceCitation?: GroundedCitation;
    tenderDeadlineStr?: string;
  }
): ActionTask {
  const derived = deriveTaskDueDateFromDeadline(params.tenderDeadlineStr, params.category);

  return {
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    tenderId: params.tenderId,
    changeId: params.changeId,
    changeIdRef: params.changeId,
    title: params.title,
    description: params.description,
    category: params.category,
    ownerRole: params.role || INDIAN_PROCUREMENT_SLA_RULES[params.category]?.defaultRole || 'BID_MANAGER',
    role: params.role || INDIAN_PROCUREMENT_SLA_RULES[params.category]?.defaultRole || 'BID_MANAGER',
    assigneeName: params.assignedTo || 'Bid Coordinator',
    assignedTo: params.assignedTo || 'Bid Coordinator',
    dueDate: derived.dueDateDisplay,
    slaPolicyRule: derived.slaPolicyRule,
    daysBeforeDeadline: derived.daysBeforeDeadline,
    isStaleDeadline: derived.isStaleDeadline,
    staleWarning: derived.staleWarning,
    priority: params.priority || 'HIGH',
    status: 'OPEN',
    sourceCitation: params.sourceCitation,
    isAiGenerated: false,
    confirmedByHuman: false,
    createdAt: new Date().toISOString(),
    provenance: 'USER_UPLOADED'
  };
}

/**
 * Re-evaluates all tasks when a tender deadline is shifted by a corrigendum
 */
export function recalculateTasksForUpdatedDeadline(
  tasks: ActionTask[],
  newDeadlineStr: string,
  referenceNow: Date = new Date()
): {
  updatedTasks: ActionTask[];
  adjustedCount: number;
  staleCount: number;
} {
  let adjustedCount = 0;
  let staleCount = 0;

  const updatedTasks = tasks.map(task => {
    const category = task.category || 'DEFAULT';
    const derived = deriveTaskDueDateFromDeadline(newDeadlineStr, category, referenceNow);

    if (derived.isStaleDeadline) {
      staleCount++;
    }

    if (task.dueDate !== derived.dueDateDisplay) {
      adjustedCount++;
    }

    return {
      ...task,
      dueDate: derived.dueDateDisplay,
      slaPolicyRule: derived.slaPolicyRule,
      daysBeforeDeadline: derived.daysBeforeDeadline,
      isStaleDeadline: derived.isStaleDeadline,
      staleWarning: derived.staleWarning
    };
  });

  return {
    updatedTasks,
    adjustedCount,
    staleCount
  };
}
