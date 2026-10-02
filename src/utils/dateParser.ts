/**
 * Deterministic Date Parser for Indian Public Procurement Documents
 * Handles CPPP, GeM, Railways, and State formats:
 * - 12-Aug-2026 15:00 hrs
 * - 19/08/2026 15:30 IST
 * - 12.08.2026
 * - 19 August 2026, 3:00 PM
 */

const MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11
};

export interface ParsedDateResult {
  rawString: string;
  date: Date | null;
  isoString: string | null;
  formatted: string;
  hasTime: boolean;
}

export function parseProcurementDate(dateStr: string): ParsedDateResult {
  if (!dateStr || typeof dateStr !== 'string') {
    return { rawString: '', date: null, isoString: null, formatted: 'UNKNOWN', hasTime: false };
  }

  const clean = dateStr.trim();

  // Pattern 1: DD-MMM-YYYY or DD MMM YYYY (e.g. 19-Aug-2026, 12 August 2026)
  const patternWordMonth = /(\d{1,2})[\s\-/.]([A-Za-z]{3,9})[\s\-/.](20\d{2})(?:\s+(?:at\s+)?(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(?:hrs|hours|pm|am|ist)?)?/i;
  const match1 = patternWordMonth.exec(clean);
  if (match1) {
    const day = parseInt(match1[1], 10);
    const monthKey = match1[2].toLowerCase();
    const year = parseInt(match1[3], 10);
    const month = MONTH_MAP[monthKey];

    if (month !== undefined && day >= 1 && day <= 31) {
      let hours = match1[4] ? parseInt(match1[4], 10) : 15;
      let minutes = match1[5] ? parseInt(match1[5], 10) : 0;
      if (/pm/i.test(clean) && hours < 12) hours += 12;
      if (/am/i.test(clean) && hours === 12) hours = 0;

      const d = new Date(Date.UTC(year, month, day, hours, minutes));
      return {
        rawString: clean,
        date: d,
        isoString: d.toISOString(),
        formatted: `${day.toString().padStart(2, '0')}-${match1[2].substring(0, 3).toUpperCase()}-${year}${match1[4] ? ` ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} IST` : ''}`,
        hasTime: Boolean(match1[4])
      };
    }
  }

  // Pattern 2: DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const patternNumeric = /(\d{1,2})[\-/. ](\d{1,2})[\-/. ](20\d{2})(?:\s+(?:at\s+)?(\d{1,2}):(\d{2}))?/i;
  const match2 = patternNumeric.exec(clean);
  if (match2) {
    const day = parseInt(match2[1], 10);
    const month = parseInt(match2[2], 10) - 1;
    const year = parseInt(match2[3], 10);

    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      const hours = match2[4] ? parseInt(match2[4], 10) : 15;
      const minutes = match2[5] ? parseInt(match2[5], 10) : 0;

      const d = new Date(Date.UTC(year, month, day, hours, minutes));
      return {
        rawString: clean,
        date: d,
        isoString: d.toISOString(),
        formatted: `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}${match2[4] ? ` ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` : ''}`,
        hasTime: Boolean(match2[4])
      };
    }
  }

  // Fallback: standard Javascript Date.parse
  const parsed = Date.parse(clean);
  if (!isNaN(parsed)) {
    const d = new Date(parsed);
    return {
      rawString: clean,
      date: d,
      isoString: d.toISOString(),
      formatted: d.toISOString().split('T')[0],
      hasTime: true
    };
  }

  return {
    rawString: clean,
    date: null,
    isoString: null,
    formatted: clean,
    hasTime: false
  };
}

/**
 * Calculate deterministic day shift between two dates
 */
export function calculateDateShift(originalStr: string, revisedStr: string): {
  shiftDays: number;
  isExtended: boolean;
  explanation: string;
} {
  const orig = parseProcurementDate(originalStr);
  const rev = parseProcurementDate(revisedStr);

  if (!orig.date || !rev.date) {
    return {
      shiftDays: 0,
      isExtended: false,
      explanation: 'Date shift could not be calculated with mathematical certainty (one or both dates are unparsed)'
    };
  }

  const diffMs = rev.date.getTime() - orig.date.getTime();
  const shiftDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const isExtended = shiftDays > 0;

  let explanation = '';
  if (shiftDays > 0) {
    explanation = `Extended by +${shiftDays} calendar day${shiftDays === 1 ? '' : 's'} (from ${orig.formatted} to ${rev.formatted})`;
  } else if (shiftDays < 0) {
    explanation = `Advanced / shortened by ${Math.abs(shiftDays)} day${Math.abs(shiftDays) === 1 ? '' : 's'} (from ${orig.formatted} to ${rev.formatted})`;
  } else {
    explanation = `Date confirmed unchanged (${orig.formatted})`;
  }

  return {
    shiftDays,
    isExtended,
    explanation
  };
}
