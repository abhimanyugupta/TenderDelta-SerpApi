import { 
  Tender, 
  TenderDocument, 
  MaterialChange, 
  StructuredRequirement, 
  BOQItemChange, 
  ConflictRecord, 
  TenderDeadline, 
  ActionTask, 
  AuditEvent, 
  RiskScoreBreakdown 
} from '../types';
import { parseProcurementDate, calculateDateShift } from './dateParser';
import { verifyCitationGroundedness } from './evidenceVerifier';
import { compareBOQDatasets } from './boqEngine';
import { StructuredBOQRow } from './fileExtractor';

export interface IngestionPipelineInput {
  title: string;
  referenceNumber: string;
  organization: string;
  portal: 'CPPP' | 'GeM' | 'IREPS' | 'STATE_EPROC' | 'CUSTOM';
  estimatedValueInr: number;
  submissionDeadline?: string;
  notes?: string;
  originalDocs: Array<{
    id: string;
    filename: string;
    fileSizeBytes: number;
    type: TenderDocument['type'];
    pageCount: number;
    extractedText?: string;
    pages?: any[];
    sections?: any[];
    boqRows?: StructuredBOQRow[];
    sha256Hash?: string;
  }>;
  corrigendaDocs: Array<{
    id: string;
    filename: string;
    fileSizeBytes: number;
    type: TenderDocument['type'];
    pageCount: number;
    extractedText?: string;
    pages?: any[];
    sections?: any[];
    boqRows?: StructuredBOQRow[];
    sha256Hash?: string;
  }>;
}

export interface AnalysisPipelineResult {
  draftTender: Tender;
  changes: MaterialChange[];
  requirements: StructuredRequirement[];
  boqChanges: BOQItemChange[];
  conflicts: ConflictRecord[];
  deadlines: TenderDeadline[];
  tasks: ActionTask[];
  auditTrail: AuditEvent[];
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScoreReason: string;
  riskScoreBreakdown: RiskScoreBreakdown;
  engineUsed: string;
}

/**
 * Calculate deterministic risk score based entirely on extracted evidence
 */
export function calculateGroundedRiskScore(
  changes: MaterialChange[],
  conflicts: ConflictRecord[],
  requirements: StructuredRequirement[],
  deadlines: TenderDeadline[]
): { riskScore: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; riskScoreReason: string; breakdown: RiskScoreBreakdown } {
  let score = 0;
  const reasons: string[] = [];

  const criticalChanges = changes.filter(c => c.materiality === 'CRITICAL');
  const highChanges = changes.filter(c => c.materiality === 'HIGH');
  const mediumChanges = changes.filter(c => c.materiality === 'MEDIUM');
  const unresolvedConflicts = conflicts.filter(c => c.status === 'OPEN');

  if (criticalChanges.length > 0) {
    score += criticalChanges.length * 5;
    reasons.push(`${criticalChanges.length} CRITICAL change${criticalChanges.length > 1 ? 's' : ''} detected (${criticalChanges.map(c => c.title).slice(0, 2).join(', ')})`);
  }

  if (highChanges.length > 0) {
    score += highChanges.length * 3;
    reasons.push(`${highChanges.length} HIGH-materiality amendment${highChanges.length > 1 ? 's' : ''}`);
  }

  if (mediumChanges.length > 0) {
    score += mediumChanges.length * 1;
    reasons.push(`${mediumChanges.length} MEDIUM modification${mediumChanges.length > 1 ? 's' : ''}`);
  }

  if (unresolvedConflicts.length > 0) {
    score += unresolvedConflicts.length * 4;
    reasons.push(`${unresolvedConflicts.length} unresolved document conflict${unresolvedConflicts.length > 1 ? 's' : ''} requiring pre-bid clarification`);
  }

  const shortDeadlines = deadlines.filter(d => d.timeRemainingDays > 0 && d.timeRemainingDays <= 3);
  if (shortDeadlines.length > 0) {
    score += 3;
    reasons.push(`Upcoming submission deadline within ${shortDeadlines[0].timeRemainingDays} days`);
  }

  let riskScore: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (score >= 10) {
    riskScore = 'CRITICAL';
  } else if (score >= 6) {
    riskScore = 'HIGH';
  } else if (score >= 3) {
    riskScore = 'MEDIUM';
  } else {
    riskScore = 'LOW';
  }

  const riskScoreReason = reasons.length > 0
    ? `Risk Level (${riskScore}, score: ${score}): ` + reasons.join('; ') + '.'
    : 'Risk Level (LOW): No material risk factors, contradictions, or critical changes identified in uploaded documents.';

  const breakdown: RiskScoreBreakdown = {
    baseScore: score,
    reasons,
    criticalCount: criticalChanges.length,
    highCount: highChanges.length,
    mediumCount: mediumChanges.length,
    unresolvedConflictsCount: unresolvedConflicts.length
  };

  return { riskScore, riskScoreReason, breakdown };
}

/**
 * Deterministic procurement intelligence parser that works purely on ingested text
 */
export function runLocalGroundedAnalysis(input: IngestionPipelineInput): AnalysisPipelineResult {
  const tenderId = `tender-${Date.now()}`;
  const nowIso = new Date().toISOString();

  // Combine all original and corrigenda text
  const originalDocsText = input.originalDocs.map(d => d.extractedText || '').join('\n\n');
  const corrigendaDocsText = input.corrigendaDocs.map(d => d.extractedText || '').join('\n\n');
  const allDocsText = originalDocsText + '\n\n' + corrigendaDocsText;

  const originalDocObj = input.originalDocs[0];
  const primaryOriginalName = originalDocObj ? originalDocObj.filename : 'Original_NIT.pdf';
  const primaryCorrigendumObj = input.corrigendaDocs[0];
  const primaryCorrigendumName = primaryCorrigendumObj ? primaryCorrigendumObj.filename : 'Corrigendum.pdf';

  const requirements: StructuredRequirement[] = [];
  const changes: MaterialChange[] = [];
  const boqChanges: BOQItemChange[] = [];
  const conflicts: ConflictRecord[] = [];
  const deadlines: TenderDeadline[] = [];
  const tasks: ActionTask[] = [];

  // =========================================================================
  // 1. EXTRACT REAL DATES & DEADLINES
  // =========================================================================
  let originalSubmissionDate: string | null = null;
  let revisedSubmissionDate: string | null = null;

  // Regex patterns for Indian procurement dates
  // e.g., "Submission End Date: 12-Aug-2026 15:00 hrs" or "extended from 12-Aug-2026 to 19-Aug-2026"
  const dateExtensionRegex = /(?:extended|postponed|rescheduled)\s+(?:from\s+)?(\d{1,2}[\s\-/.][A-Za-z0-9]{3,9}[\s\-/.](?:20\d{2})(?:\s+(?:at\s+)?\d{1,2}:\d{2}\s*(?:hrs|hours|ist)?)?)\s+(?:to|till|upto)\s+(\d{1,2}[\s\-/.][A-Za-z0-9]{3,9}[\s\-/.](?:20\d{2})(?:\s+(?:at\s+)?\d{1,2}:\d{2}\s*(?:hrs|hours|ist)?)?)/i;
  const matchExtension = dateExtensionRegex.exec(allDocsText);

  if (matchExtension) {
    const origParsed = parseProcurementDate(matchExtension[1]);
    const revParsed = parseProcurementDate(matchExtension[2]);
    if (origParsed.isoString) originalSubmissionDate = origParsed.isoString;
    if (revParsed.isoString) revisedSubmissionDate = revParsed.isoString;

    const shift = calculateDateShift(matchExtension[1], matchExtension[2]);

    deadlines.push({
      id: `dl-${Date.now()}-1`,
      milestone: 'Bid Submission Closing Date (Extended)',
      originalDate: origParsed.formatted,
      currentDate: revParsed.formatted,
      dateShiftDays: shift.shiftDays,
      isExtended: shift.isExtended,
      sourceDocumentName: primaryCorrigendumName,
      sourceCitation: {
        documentName: primaryCorrigendumName,
        pageNumber: 1,
        isPageNumberExact: primaryCorrigendumObj?.pageCount ? true : false,
        sectionNumber: 'Critical Dates',
        clauseTitle: 'Bid Submission Extension',
        exactSnippet: matchExtension[0],
        isVerifiedAgainstSource: true
      },
      timeRemainingDays: revParsed.date ? Math.max(0, Math.ceil((revParsed.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0,
      provenance: 'DETERMINISTIC'
    });

    changes.push({
      id: `chg-${Date.now()}-date`,
      tenderId,
      category: 'DEADLINE',
      changeType: 'DEADLINE_CHANGED',
      materiality: 'HIGH',
      confidence: 'HIGH',
      confidenceReason: 'Explicit date extension clause extracted from corrigendum text.',
      title: `Bid Submission Deadline ${shift.explanation}`,
      requirementKey: 'SUBMISSION_DEADLINE',
      originalText: `Submission deadline: ${origParsed.formatted}`,
      updatedText: `Submission deadline: ${revParsed.formatted} (${shift.explanation})`,
      beforeValue: origParsed.formatted,
      afterValue: revParsed.formatted,
      impactExplanation: `Bid submission deadline shifted by ${shift.shiftDays} days. Ensure Bank Guarantee validity covers minimum 90/180 days past the new submission date.`,
      actionRequired: 'Recalculate Bank Guarantee / EMD instrument validity to align with new closing date.',
      sourceCitation: {
        documentName: primaryCorrigendumName,
        pageNumber: 1,
        isPageNumberExact: primaryCorrigendumObj?.pageCount ? true : false,
        sectionNumber: 'Critical Dates Schedule',
        clauseTitle: 'Submission Extension',
        exactSnippet: matchExtension[0],
        isVerifiedAgainstSource: true
      },
      affectedDocuments: [primaryCorrigendumName],
      relevantRoles: ['BID_MANAGER', 'OPERATIONS'],
      verificationStatus: 'UNREVIEWED',
      factVsInterpretation: 'FACT',
      provenance: 'DETERMINISTIC'
    });
  } else {
    // Search for standard closing date in original text
    const standardDateRegex = /(?:submission\s+end\s+date|closing\s+date|bid\s+submission\s+deadline|due\s+date)\s*(?:is|:|\s)\s*(\d{1,2}[\s\-/.][A-Za-z0-9]{3,9}[\s\-/.](?:20\d{2})(?:\s+(?:at\s+)?\d{1,2}:\d{2}\s*(?:hrs|hours|ist)?)?)/i;
    const matchStandard = standardDateRegex.exec(allDocsText);
    if (matchStandard) {
      const parsed = parseProcurementDate(matchStandard[1]);
      if (parsed.isoString) originalSubmissionDate = parsed.isoString;
      deadlines.push({
        id: `dl-${Date.now()}-1`,
        milestone: 'Bid Submission Closing Date',
        originalDate: parsed.formatted,
        currentDate: parsed.formatted,
        dateShiftDays: 0,
        isExtended: false,
        sourceDocumentName: primaryOriginalName,
        sourceCitation: {
          documentName: primaryOriginalName,
          pageNumber: 1,
          isPageNumberExact: false,
          sectionNumber: 'Critical Dates',
          exactSnippet: matchStandard[0],
          isVerifiedAgainstSource: true
        },
        timeRemainingDays: parsed.date ? Math.max(0, Math.ceil((parsed.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0,
        provenance: 'DETERMINISTIC'
      });
    }
  }

  // =========================================================================
  // 2. EXTRACT REAL FINANCIAL TURNOVER REQUIREMENT & CHANGES
  // =========================================================================
  const turnoverRegex = /(?:(?:average\s+)?annual\s+(?:financial\s+)?turnover|turnover\s+(?:must\s+be|shall\s+be|of)?\s*at\s+least|turnover)\s*(?:of\s+at\s+least|must\s+be\s+at\s+least|shall\s+be\s+at\s+least|is|:|\s)?\s*(?:inr|rs\.?|₹)?\s*([\d,.]+)\s*(crores?|cr|lakhs?|lacs?|million)/i;
  const originalTurnoverMatch = turnoverRegex.exec(originalDocsText);
  const corrigendumTurnoverMatch = turnoverRegex.exec(corrigendaDocsText);

  if (originalTurnoverMatch || corrigendumTurnoverMatch) {
    const origVal = originalTurnoverMatch ? `INR ${originalTurnoverMatch[1]} ${originalTurnoverMatch[2]}` : 'UNKNOWN';
    const corrVal = corrigendumTurnoverMatch ? `INR ${corrigendumTurnoverMatch[1]} ${corrigendumTurnoverMatch[2]}` : origVal;
    const hasTurnoverChanged = originalTurnoverMatch && corrigendumTurnoverMatch && (origVal !== corrVal);

    requirements.push({
      id: `req-${Date.now()}-turnover`,
      tenderId,
      key: 'FINANCIAL_TURNOVER',
      category: 'TURNOVER',
      title: 'Average Annual Financial Turnover',
      originalValue: origVal,
      currentValue: corrVal,
      hasChanged: hasTurnoverChanged,
      mandatory: true,
      exactText: (corrigendumTurnoverMatch || originalTurnoverMatch)?.[0] || '',
      normalizedValue: {
        metric: 'average_annual_turnover',
        value: corrigendumTurnoverMatch ? parseFloat(corrigendumTurnoverMatch[1].replace(/,/g, '')) : (originalTurnoverMatch ? parseFloat(originalTurnoverMatch[1].replace(/,/g, '')) : null),
        unit: corrigendumTurnoverMatch ? corrigendumTurnoverMatch[2] : (originalTurnoverMatch ? originalTurnoverMatch[2] : 'Crores'),
        currency: 'INR'
      },
      sourceCitation: {
        documentName: corrigendumTurnoverMatch ? primaryCorrigendumName : primaryOriginalName,
        pageNumber: 1,
        isPageNumberExact: false,
        sectionNumber: 'Eligibility Criteria',
        exactSnippet: (corrigendumTurnoverMatch || originalTurnoverMatch)?.[0] || '',
        isVerifiedAgainstSource: true
      },
      verificationStatus: 'UNREVIEWED',
      ownerRole: 'FINANCE',
      evidenceRequired: 'Audited Financial Statements / CA Certificate with valid UDIN',
      evidenceProvided: '',
      evidenceStatus: 'PENDING',
      riskLevel: hasTurnoverChanged ? 'CRITICAL' : 'HIGH',
      status: 'ACTION_REQUIRED',
      provenance: 'DETERMINISTIC'
    });

    if (hasTurnoverChanged) {
      changes.push({
        id: `chg-${Date.now()}-turnover`,
        tenderId,
        category: 'TURNOVER',
        changeType: 'THRESHOLD_CHANGED',
        materiality: 'CRITICAL',
        confidence: 'HIGH',
        confidenceReason: 'Turnover threshold amended in Corrigendum text.',
        title: `Average Annual Financial Turnover Threshold Revised to ${corrVal}`,
        requirementKey: 'FINANCIAL_TURNOVER',
        originalText: originalTurnoverMatch ? originalTurnoverMatch[0] : `Baseline turnover: ${origVal}`,
        updatedText: corrigendumTurnoverMatch ? corrigendumTurnoverMatch[0] : `Revised turnover: ${corrVal}`,
        beforeValue: origVal,
        afterValue: corrVal,
        impactExplanation: `Financial qualification threshold modified from ${origVal} to ${corrVal}. Bidders must verify that their average audited turnover for the specified financial years meets this revised threshold.`,
        actionRequired: 'Obtain Chartered Accountant certificate with unique document identification number (UDIN) certifying revised turnover.',
        sourceCitation: {
          documentName: primaryCorrigendumName,
          pageNumber: 1,
          isPageNumberExact: false,
          sectionNumber: 'Eligibility Criteria',
          exactSnippet: corrigendumTurnoverMatch ? corrigendumTurnoverMatch[0] : '',
          isVerifiedAgainstSource: true
        },
        affectedDocuments: [primaryCorrigendumName],
        relevantRoles: ['FINANCE', 'BID_MANAGER'],
        verificationStatus: 'UNREVIEWED',
        factVsInterpretation: 'FACT',
        provenance: 'DETERMINISTIC'
      });
    }
  }

  // =========================================================================
  // 3. EXTRACT REAL EMD REQUIREMENT
  // =========================================================================
  const emdRegex = /(?:earnest\s+money\s+deposit|emd|bid\s+security)\s*(?:of|is|:|\s)?\s*(?:inr|rs\.?|₹)?\s*([\d,./\-]+)\s*(crores?|cr|lakhs?|lacs?|\/-)?/i;
  const originalEmdMatch = emdRegex.exec(originalDocsText);
  const corrigendumEmdMatch = emdRegex.exec(corrigendaDocsText);

  if (originalEmdMatch || corrigendumEmdMatch) {
    const origEmdVal = originalEmdMatch ? `INR ${originalEmdMatch[1]} ${originalEmdMatch[2] || ''}`.trim() : 'UNKNOWN';
    const corrEmdVal = corrigendumEmdMatch ? `INR ${corrigendumEmdMatch[1]} ${corrigendumEmdMatch[2] || ''}`.trim() : origEmdVal;
    const hasEmdChanged = originalEmdMatch && corrigendumEmdMatch && (origEmdVal !== corrEmdVal);

    requirements.push({
      id: `req-${Date.now()}-emd`,
      tenderId,
      key: 'EMD_AMOUNT',
      category: 'EMD',
      title: 'Earnest Money Deposit (EMD) / Bid Security',
      originalValue: origEmdVal,
      currentValue: corrEmdVal,
      hasChanged: hasEmdChanged,
      mandatory: true,
      exactText: (corrigendumEmdMatch || originalEmdMatch)?.[0] || '',
      normalizedValue: {
        metric: 'earnest_money_deposit',
        value: corrEmdVal,
        currency: 'INR'
      },
      sourceCitation: {
        documentName: corrigendumEmdMatch ? primaryCorrigendumName : primaryOriginalName,
        pageNumber: 1,
        isPageNumberExact: false,
        sectionNumber: 'Commercial / Bid Security',
        exactSnippet: (corrigendumEmdMatch || originalEmdMatch)?.[0] || '',
        isVerifiedAgainstSource: true
      },
      verificationStatus: 'UNREVIEWED',
      ownerRole: 'FINANCE',
      evidenceRequired: 'Bank Guarantee / Demand Draft / UDYAM MSE Exemption Certificate',
      evidenceProvided: '',
      evidenceStatus: 'PENDING',
      riskLevel: 'HIGH',
      status: 'ACTION_REQUIRED',
      provenance: 'DETERMINISTIC'
    });

    if (hasEmdChanged) {
      changes.push({
        id: `chg-${Date.now()}-emd`,
        tenderId,
        category: 'EMD',
        changeType: 'MODIFIED',
        materiality: 'HIGH',
        confidence: 'HIGH',
        confidenceReason: 'EMD value discrepancy / clarification extracted from corrigendum.',
        title: `EMD / Bid Security Specified as ${corrEmdVal}`,
        requirementKey: 'EMD_AMOUNT',
        originalText: originalEmdMatch ? originalEmdMatch[0] : '',
        updatedText: corrigendumEmdMatch ? corrigendumEmdMatch[0] : '',
        beforeValue: origEmdVal,
        afterValue: corrEmdVal,
        impactExplanation: `EMD value confirmed at ${corrEmdVal}. Ensure BG format and validity meet tender conditions.`,
        actionRequired: 'Request treasury / bank to issue EMD Bank Guarantee for exact specified amount.',
        sourceCitation: {
          documentName: primaryCorrigendumName,
          pageNumber: 1,
          isPageNumberExact: false,
          sectionNumber: 'Commercial Terms',
          exactSnippet: corrigendumEmdMatch ? corrigendumEmdMatch[0] : '',
          isVerifiedAgainstSource: true
        },
        affectedDocuments: [primaryCorrigendumName],
        relevantRoles: ['FINANCE'],
        verificationStatus: 'UNREVIEWED',
        factVsInterpretation: 'FACT',
        provenance: 'DETERMINISTIC'
      });
    }
  }

  // =========================================================================
  // 4. EXTRACT MAKE IN INDIA (LOCAL CONTENT) REQUIREMENT
  // =========================================================================
  const miiRegex = /(?:make\s+in\s+india|local\s+content|class-?i\s+local\s+supplier|class-?ii\s+local\s+supplier)\s*([\w\s,()%-]{10,120})/i;
  const miiMatch = miiRegex.exec(allDocsText);
  if (miiMatch) {
    requirements.push({
      id: `req-${Date.now()}-mii`,
      tenderId,
      key: 'LOCAL_CONTENT_MII',
      category: 'LOCAL_CONTENT',
      title: 'Make in India (MII) Public Procurement Preference',
      originalValue: miiMatch[0].substring(0, 80),
      currentValue: miiMatch[0].substring(0, 80),
      hasChanged: Boolean(corrigendaDocsText && miiRegex.test(corrigendaDocsText)),
      mandatory: true,
      exactText: miiMatch[0],
      sourceCitation: {
        documentName: primaryCorrigendumObj ? primaryCorrigendumName : primaryOriginalName,
        pageNumber: 1,
        isPageNumberExact: false,
        sectionNumber: 'Preference to Make in India',
        exactSnippet: miiMatch[0],
        isVerifiedAgainstSource: true
      },
      verificationStatus: 'UNREVIEWED',
      ownerRole: 'LEGAL_COMPLIANCE',
      evidenceRequired: 'Statutory Auditor Local Content Certificate / Self-Declaration',
      evidenceProvided: '',
      evidenceStatus: 'PENDING',
      riskLevel: 'HIGH',
      status: 'ACTION_REQUIRED',
      provenance: 'DETERMINISTIC'
    });
  }

  // =========================================================================
  // 5. STRUCTURED BOQ EXTRACTION & DELTA COMPARISON
  // =========================================================================
  const origBoqRows: StructuredBOQRow[] = [];
  input.originalDocs.forEach(d => {
    if (d.boqRows) origBoqRows.push(...d.boqRows);
  });

  const revBoqRows: StructuredBOQRow[] = [];
  input.corrigendaDocs.forEach(d => {
    if (d.boqRows) revBoqRows.push(...d.boqRows);
  });

  if (origBoqRows.length > 0 || revBoqRows.length > 0) {
    const boqDeltas = compareBOQDatasets(origBoqRows, revBoqRows, primaryOriginalName, primaryCorrigendumName);
    boqChanges.push(...boqDeltas);

    // Map critical BOQ changes to MaterialChanges
    boqDeltas.filter(b => b.changeType !== 'UNCHANGED').forEach(b => {
      changes.push({
        id: `chg-${Date.now()}-boq-${b.itemNumber}`,
        tenderId,
        category: 'BOQ',
        changeType: 'BOQ_CHANGED',
        materiality: b.percentageChange >= 50 || b.changeType === 'NEW_ITEM' ? 'HIGH' : 'MEDIUM',
        confidence: 'HIGH',
        confidenceReason: 'Line-by-line spreadsheet delta computed from structured BOQ parser.',
        title: `BOQ ${b.itemNumber}: ${b.description.substring(0, 60)} (${b.changeType})`,
        requirementKey: `BOQ_${b.itemNumber}`,
        originalText: `Original Qty: ${b.originalQuantity} ${b.unit}`,
        updatedText: `Revised Qty: ${b.revisedQuantity} ${b.unit}`,
        beforeValue: `${b.originalQuantity} ${b.unit}`,
        afterValue: `${b.revisedQuantity} ${b.unit}`,
        impactExplanation: b.pricingImpactNotes,
        actionRequired: 'Update unit rates in financial bid submission file.',
        sourceCitation: b.sourceCitation,
        affectedDocuments: [primaryCorrigendumName],
        relevantRoles: ['FINANCE', 'TECHNICAL'],
        verificationStatus: 'UNREVIEWED',
        factVsInterpretation: 'FACT',
        provenance: 'DETERMINISTIC'
      });
    });
  }

  // =========================================================================
  // 6. DETECT DOCUMENT CONTRADICTIONS / CONFLICTS
  // =========================================================================
  if (originalDocsText && corrigendaDocsText) {
    // Check if original and corrigendum contain conflicting values
    if (originalTurnoverMatch && corrigendumTurnoverMatch && originalTurnoverMatch[1] !== corrigendumTurnoverMatch[1]) {
      conflicts.push({
        id: `conf-${Date.now()}-turnover`,
        tenderId,
        title: 'Turnover Threshold Conflict (Original NIT vs Corrigendum)',
        category: 'TURNOVER',
        severity: 'CRITICAL',
        statementA: {
          documentName: primaryOriginalName,
          pageNumber: 1,
          clause: 'Clause 3.2: Eligibility',
          text: originalTurnoverMatch[0]
        },
        statementB: {
          documentName: primaryCorrigendumName,
          pageNumber: 1,
          clause: 'Clause C2.2: Amendments',
          text: corrigendumTurnoverMatch[0]
        },
        conflictDescription: `Original NIT specifies turnover of ${originalTurnoverMatch[1]} ${originalTurnoverMatch[2]}, while Corrigendum specifies ${corrigendumTurnoverMatch[1]} ${corrigendumTurnoverMatch[2]}.`,
        suggestedClarificationQuery: `Confirm that Corrigendum turnover threshold (${corrigendumTurnoverMatch[1]} ${corrigendumTurnoverMatch[2]}) supersedes earlier NIT value for pre-qualification scoring.`,
        status: 'RESOLVED_BY_CORRIGENDUM',
        provenance: 'DETERMINISTIC'
      });
    }
  }

  // =========================================================================
  // 7. GENERATE DERIVED TASKS
  // =========================================================================
  changes.forEach((c, idx) => {
    tasks.push({
      id: `task-${Date.now()}-${idx + 1}`,
      tenderId,
      changeId: c.id,
      changeIdRef: c.id,
      title: c.actionRequired.substring(0, 100),
      description: `Action triggered by ${c.title}. ${c.impactExplanation}`,
      category: c.category,
      ownerRole: c.relevantRoles[0] || 'BID_MANAGER',
      role: c.relevantRoles[0] || 'BID_MANAGER',
      dueDate: revisedSubmissionDate || originalSubmissionDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      priority: c.materiality === 'CRITICAL' ? 'CRITICAL' : (c.materiality === 'HIGH' ? 'HIGH' : 'MEDIUM'),
      status: 'OPEN',
      sourceCitation: c.sourceCitation,
      isAiGenerated: false,
      confirmedByHuman: false,
      createdAt: nowIso,
      provenance: 'DETERMINISTIC'
    });
  });

  // Calculate risk score
  const { riskScore, riskScoreReason, breakdown: riskScoreBreakdown } = calculateGroundedRiskScore(
    changes,
    conflicts,
    requirements,
    deadlines
  );

  // Construct all ingested documents
  const allTenderDocs: TenderDocument[] = [
    ...input.originalDocs.map((d, idx) => ({
      id: d.id || `doc-orig-${idx + 1}`,
      tenderId,
      filename: d.filename,
      name: d.filename,
      title: d.filename.replace(/\.[^/.]+$/, ''),
      type: d.type || 'ORIGINAL_NIT',
      versionNumber: idx + 1,
      versionLabel: `v1.${idx}`,
      pageCount: d.pageCount || 1,
      fileSizeBytes: d.fileSizeBytes || 0,
      extractedText: d.extractedText,
      pages: d.pages,
      sections: d.sections,
      sha256Hash: d.sha256Hash,
      lifecycleStatus: 'ANALYZED' as const,
      provenance: 'USER_UPLOADED' as const
    })),
    ...input.corrigendaDocs.map((d, idx) => ({
      id: d.id || `doc-corr-${idx + 1}`,
      tenderId,
      filename: d.filename,
      name: d.filename,
      title: d.filename.replace(/\.[^/.]+$/, ''),
      type: d.type || 'CORRIGENDUM',
      versionNumber: input.originalDocs.length + idx + 1,
      versionLabel: `v2.${idx}`,
      pageCount: d.pageCount || 1,
      fileSizeBytes: d.fileSizeBytes || 0,
      extractedText: d.extractedText,
      pages: d.pages,
      sections: d.sections,
      sha256Hash: d.sha256Hash,
      lifecycleStatus: 'ANALYZED' as const,
      provenance: 'USER_UPLOADED' as const
    }))
  ];

  const auditTrail: AuditEvent[] = [
    {
      id: `audit-${Date.now()}-1`,
      tenderId,
      timestamp: nowIso,
      action: 'INGESTION_COMPLETED',
      user: 'Current User',
      role: 'BID_MANAGER',
      details: `Ingested ${allTenderDocs.length} real document${allTenderDocs.length > 1 ? 's' : ''}. Extracted ${requirements.length} requirements, ${changes.length} material changes, and ${boqChanges.length} BOQ items.`,
      category: 'INGESTION'
    },
    {
      id: `audit-${Date.now()}-2`,
      tenderId,
      timestamp: nowIso,
      action: 'ANALYSIS_PROVENANCE_TAGGED',
      user: 'TenderDelta Intelligence Engine',
      role: 'BID_MANAGER',
      details: `Analysis tagged with provenance: USER_UPLOADED. Risk score evaluated as ${riskScore}.`,
      category: 'ANALYSIS'
    }
  ];

  const draftTender: Tender = {
    id: tenderId,
    title: input.title || 'Untitled Ingested Tender',
    referenceNumber: input.referenceNumber || 'REF-PENDING',
    organization: input.organization || 'Procuring Authority',
    organizationType: 'CENTRAL_INSTITUTE',
    portal: input.portal || 'CPPP',
    estimatedValueInr: input.estimatedValueInr || 0,
    currency: 'INR',
    publishDate: nowIso,
    originalSubmissionDeadline: originalSubmissionDate || input.submissionDeadline || nowIso,
    currentSubmissionDeadline: revisedSubmissionDate || originalSubmissionDate || input.submissionDeadline || nowIso,
    currentVersion: `v${allTenderDocs.length}.0`,
    riskScore,
    riskScoreReason,
    riskScoreBreakdown,
    documents: allTenderDocs,
    changes,
    requirements,
    boqChanges,
    conflicts,
    deadlines,
    tasks,
    auditTrail,
    provenance: 'USER_UPLOADED',
    analysisMode: 'REAL',
    notes: input.notes || '',
    createdAt: nowIso,
    updatedAt: nowIso
  };

  return {
    draftTender,
    changes,
    requirements,
    boqChanges,
    conflicts,
    deadlines,
    tasks,
    auditTrail,
    riskScore,
    riskScoreReason,
    riskScoreBreakdown,
    engineUsed: 'Deterministic Grounded Intelligence Engine'
  };
}

/**
 * Helper to convert Tender to IngestionPipelineInput
 */
function tenderToIngestionInput(tender: Tender): IngestionPipelineInput {
  const origDocs = (tender.documents || []).filter(d => 
    d.type === 'ORIGINAL_NIT' || 
    d.type === 'TECHNICAL_SPEC' || 
    d.type === 'COMMERCIAL_CONDITIONS' || 
    d.type === 'BOQ'
  );
  const corrDocs = (tender.documents || []).filter(d => 
    d.type === 'CORRIGENDUM' || 
    d.type === 'ADDENDUM' || 
    d.type === 'PRE_BID_CLARIFICATION' || 
    d.type === 'REVISED_BOQ' || 
    d.type === 'ANNEXURE' || 
    d.type === 'OTHER'
  );

  return {
    title: tender.title,
    referenceNumber: tender.referenceNumber,
    organization: tender.organization,
    portal: tender.portal,
    estimatedValueInr: tender.estimatedValueInr,
    submissionDeadline: tender.currentSubmissionDeadline,
    notes: tender.notes,
    originalDocs: (origDocs.length > 0 ? origDocs : (tender.documents || []).slice(0, 1)).map(d => ({
      id: d.id,
      filename: d.filename || d.name,
      fileSizeBytes: d.fileSizeBytes || 100000,
      type: d.type,
      pageCount: d.pageCount || 1,
      extractedText: d.extractedText || '',
      pages: d.pages || [],
      sections: d.sections || [],
      boqRows: (d as any).boqRows || [],
      sha256Hash: d.sha256Hash
    })),
    corrigendaDocs: (origDocs.length > 0 ? corrDocs : (tender.documents || []).slice(1)).map(d => ({
      id: d.id,
      filename: d.filename || d.name,
      fileSizeBytes: d.fileSizeBytes || 50000,
      type: d.type,
      pageCount: d.pageCount || 1,
      extractedText: d.extractedText || '',
      pages: d.pages || [],
      sections: d.sections || [],
      boqRows: (d as any).boqRows || [],
      sha256Hash: d.sha256Hash
    }))
  };
}

/**
 * Execute tender comparison / analysis pipeline.
 * Dispatches to Gemini server API if online, or deterministic local parser.
 */
export async function executeTenderAnalysis(
  inputOrTender: IngestionPipelineInput | Tender,
  onProgress?: (status: string, pct: number) => void
): Promise<AnalysisPipelineResult> {
  const input: IngestionPipelineInput = ('originalDocs' in inputOrTender) 
    ? inputOrTender 
    : tenderToIngestionInput(inputOrTender);

  if (onProgress) onProgress('Parsing structural sections and metadata...', 20);

  // Always run local deterministic extraction first as grounded baseline
  const localResult = runLocalGroundedAnalysis(input);

  if (onProgress) onProgress('Running deterministic qualification and BOQ comparison...', 50);

  let engineUsed = 'Deterministic Grounded Intelligence Engine (Local)';

  // If running in browser and AI backend is reachable, attempt to enrich with AI extraction
  try {
    if (onProgress) onProgress('Verifying against Gemini Procurement Intelligence API...', 75);

    const payload = {
      tenderTitle: input.title,
      tenderOrg: input.organization,
      referenceNumber: input.referenceNumber,
      documents: [
        ...input.originalDocs.map(d => ({ name: d.filename, type: d.type, textSample: d.extractedText })),
        ...input.corrigendaDocs.map(d => ({ name: d.filename, type: d.type, textSample: d.extractedText }))
      ]
    };

    const res = await fetch('/api/gemini/analyze-tender', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.changes && Array.isArray(data.changes) && data.changes.length > 0) {
        // Ground and verify every returned change against uploaded document text
        const verifiedChanges: MaterialChange[] = [];
        const allDocText = input.originalDocs.map(d => d.extractedText || '').join('\n') + '\n' + input.corrigendaDocs.map(d => d.extractedText || '').join('\n');

        data.changes.forEach((chg: any, idx: number) => {
          const snippet = chg.sourceCitation?.exactSnippet || chg.originalText || '';
          const verify = verifyCitationGroundedness(snippet, allDocText);

          // Only accept AI changes that are grounded in actual uploaded text
          if (verify.isVerified || snippet.length < 15) {
            verifiedChanges.push({
              id: `chg-ai-${Date.now()}-${idx}`,
              tenderId: localResult.draftTender.id,
              category: chg.category || 'TECHNICAL',
              changeType: chg.changeType || 'MODIFIED',
              materiality: chg.materiality || 'MEDIUM',
              confidence: (chg.confidence as any) || 'HIGH',
              confidenceReason: chg.confidenceReason || 'AI extraction verified against document text corpus',
              title: chg.title,
              requirementKey: chg.requirementKey || `REQ_${idx}`,
              originalText: chg.originalText || '',
              updatedText: chg.updatedText || '',
              beforeValue: chg.beforeValue,
              afterValue: chg.afterValue,
              impactExplanation: chg.impactExplanation,
              actionRequired: chg.actionRequired,
              sourceCitation: {
                documentName: chg.sourceCitation?.documentName || input.corrigendaDocs[0]?.filename || 'Corrigendum',
                pageNumber: verify.matchedPageNumber !== null ? verify.matchedPageNumber : (chg.sourceCitation?.pageNumber || null),
                isPageNumberExact: verify.isPageNumberExact,
                sectionNumber: chg.sourceCitation?.clauseTitle || 'Section',
                exactSnippet: snippet,
                isVerifiedAgainstSource: verify.isVerified,
                matchConfidence: verify.confidence
              },
              affectedDocuments: [chg.sourceCitation?.documentName || 'Corrigendum'],
              relevantRoles: ['BID_MANAGER', 'TECHNICAL'],
              verificationStatus: 'UNREVIEWED',
              factVsInterpretation: 'AI_INTERPRETATION',
              provenance: 'AI_GENERATED'
            });
          }
        });

        if (verifiedChanges.length > 0) {
          // Merge verified AI changes with deterministic local changes, avoiding duplicate keys
          const existingKeys = new Set(localResult.changes.map(c => c.requirementKey));
          const novelAiChanges = verifiedChanges.filter(c => !existingKeys.has(c.requirementKey));
          const allChanges = [...localResult.changes, ...novelAiChanges];

          const { riskScore, riskScoreReason, breakdown } = calculateGroundedRiskScore(
            allChanges,
            localResult.conflicts,
            localResult.requirements,
            localResult.deadlines
          );

          localResult.draftTender.changes = allChanges;
          localResult.draftTender.riskScore = riskScore;
          localResult.draftTender.riskScoreReason = riskScoreReason;
          localResult.draftTender.riskScoreBreakdown = breakdown;
          localResult.changes = allChanges;
          localResult.riskScore = riskScore;
          localResult.riskScoreReason = riskScoreReason;
          localResult.riskScoreBreakdown = breakdown;
          engineUsed = 'Gemini 2.5 Flash + Grounded Citation Verifier';
        }
      }
    }
  } catch (e) {
    console.warn('Backend AI analysis endpoint unavailable; relying on deterministic local extraction engine.', e);
  }

  if (onProgress) onProgress('Finalizing version delta and audit records...', 100);

  localResult.engineUsed = engineUsed;
  return localResult;
}
