import { Tender, AuditEvent } from '../types';
import { DEMO_TENDER } from '../data/demoTender';

const STORAGE_KEY = 'tenderdelta_workspaces_v3';
const ACTIVE_TENDER_KEY = 'tenderdelta_active_tender_id_v3';

// Legacy keys for migration
const LEGACY_STORAGE_KEYS = ['tenderdelta_workspaces_v2', 'tenderdelta_workspaces_v1'];
const LEGACY_ACTIVE_KEYS = ['tenderdelta_active_tender_id_v2', 'tenderdelta_active_tender_id_v1'];

/**
 * Sanitize a tender to ensure no DEMO data contaminates real user tenders
 */
function sanitizeTender(tender: Tender): Tender {
  if (tender.id === DEMO_TENDER.id) {
    return {
      ...DEMO_TENDER,
      provenance: 'SYNTHETIC_DEMO',
      analysisMode: 'DEMO'
    };
  }

  // For user-uploaded tenders, verify that no demo-specific citations linger if those files don't exist in tender.documents
  const docNames = new Set((tender.documents || []).map(d => d.filename || d.name));
  
  // Filter out any orphaned changes that cite demo files when those files are not in the document library
  const sanitizedChanges = (tender.changes || []).filter(c => {
    const citedDoc = c.sourceCitation?.documentName;
    if (!citedDoc) return true;
    if (citedDoc.includes('Corrigendum_2_Substantive_Amendments.pdf') && !docNames.has(citedDoc)) {
      return false;
    }
    return true;
  });

  return {
    ...tender,
    changes: sanitizedChanges,
    provenance: 'USER_UPLOADED',
    analysisMode: 'REAL'
  };
}

/**
 * Load all tenders from localStorage with schema v3 migration
 */
export function loadStoredTenders(): Tender[] {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);

    // If v3 is not found, check legacy keys
    if (!raw) {
      for (const legacyKey of LEGACY_STORAGE_KEYS) {
        const legacyRaw = localStorage.getItem(legacyKey);
        if (legacyRaw) {
          raw = legacyRaw;
          break;
        }
      }
    }

    if (!raw) {
      const initial = [DEMO_TENDER];
      saveStoredTenders(initial);
      return initial;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const sanitized = parsed.map(sanitizeTender);
      const hasDemo = sanitized.some(t => t.id === DEMO_TENDER.id);
      const result = hasDemo ? sanitized : [DEMO_TENDER, ...sanitized];
      saveStoredTenders(result);
      return result;
    }
    return [DEMO_TENDER];
  } catch (e) {
    console.error('Failed to parse stored tenders from localStorage', e);
    return [DEMO_TENDER];
  }
}

/**
 * Save tenders list to localStorage
 */
export function saveStoredTenders(tenders: Tender[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tenders));
  } catch (e) {
    console.error('Failed to save tenders to localStorage', e);
  }
}

/**
 * Load active tender ID
 */
export function loadActiveTenderId(): string {
  try {
    let activeId = localStorage.getItem(ACTIVE_TENDER_KEY);
    if (!activeId) {
      for (const legacyKey of LEGACY_ACTIVE_KEYS) {
        const legacyVal = localStorage.getItem(legacyKey);
        if (legacyVal) {
          activeId = legacyVal;
          break;
        }
      }
    }
    return activeId || DEMO_TENDER.id;
  } catch (e) {
    return DEMO_TENDER.id;
  }
}

/**
 * Save active tender ID
 */
export function saveActiveTenderId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_TENDER_KEY, id);
  } catch (e) {
    console.error('Failed to save active tender ID', e);
  }
}

/**
 * Append an audit event to a tender
 */
export function appendAuditEvent(
  tender: Tender,
  action: string,
  details: string,
  user = 'Current User',
  role = 'BID_MANAGER',
  category: AuditEvent['category'] = 'SETTINGS'
): Tender {
  const event: AuditEvent = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    tenderId: tender.id,
    timestamp: new Date().toISOString(),
    action,
    user,
    role,
    details,
    category
  };

  const updatedTrail = [event, ...(tender.auditTrail || [])];
  return {
    ...tender,
    auditTrail: updatedTrail,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Reset stored workspaces to fresh default
 */
export function resetStoredWorkspaces(): Tender[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_TENDER_KEY);
    for (const legacyKey of LEGACY_STORAGE_KEYS) localStorage.removeItem(legacyKey);
    for (const legacyKey of LEGACY_ACTIVE_KEYS) localStorage.removeItem(legacyKey);

    const initial = [DEMO_TENDER];
    saveStoredTenders(initial);
    saveActiveTenderId(DEMO_TENDER.id);
    return initial;
  } catch (e) {
    return [DEMO_TENDER];
  }
}
