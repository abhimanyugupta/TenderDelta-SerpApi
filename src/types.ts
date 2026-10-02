export type ProvenanceType = 'USER_UPLOADED' | 'SYNTHETIC_DEMO' | 'DETERMINISTIC' | 'AI_GENERATED';

export type AnalysisMode = 'DEMO' | 'REAL';

export type DocumentLifecycleStatus = 
  | 'SELECTED'
  | 'UPLOADING'
  | 'UPLOADED'
  | 'PARSING'
  | 'PARSED'
  | 'ANALYZING'
  | 'ANALYZED'
  | 'FAILED';

export type DocumentType = 
  | 'ORIGINAL_NIT'
  | 'TECHNICAL_SPEC'
  | 'COMMERCIAL_CONDITIONS'
  | 'BOQ'
  | 'CORRIGENDUM'
  | 'ADDENDUM'
  | 'PRE_BID_CLARIFICATION'
  | 'REVISED_BOQ'
  | 'ANNEXURE'
  | 'OTHER';

export type MaterialityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';

export type ChangeType =
  | 'ADDED'
  | 'REMOVED'
  | 'MODIFIED'
  | 'DEADLINE_CHANGED'
  | 'THRESHOLD_CHANGED'
  | 'QUANTITY_CHANGED'
  | 'UNIT_CHANGED'
  | 'ELIGIBILITY_CHANGED'
  | 'DOCUMENT_REQUIREMENT_CHANGED'
  | 'CLAUSE_RENAMED'
  | 'BOQ_CHANGED'
  | 'AMBIGUITY_INTRODUCED'
  | 'CONFLICT_CREATED'
  | 'CLARIFICATION'
  | 'NO_MATERIAL_CHANGE';

export type RequirementCategory =
  | 'ELIGIBILITY'
  | 'TECHNICAL'
  | 'FINANCIAL'
  | 'COMMERCIAL'
  | 'DOCUMENTATION'
  | 'EMD'
  | 'PERFORMANCE_SECURITY'
  | 'EXPERIENCE'
  | 'TURNOVER'
  | 'CERTIFICATION'
  | 'MANPOWER'
  | 'EQUIPMENT'
  | 'DELIVERY'
  | 'WARRANTY'
  | 'SUBMISSION'
  | 'DEADLINE'
  | 'BOQ'
  | 'LEGAL'
  | 'LOCAL_CONTENT'
  | 'OTHER';

export type UserRoleView = 'ALL' | 'BID_MANAGER' | 'FINANCE' | 'TECHNICAL' | 'LEGAL_COMPLIANCE' | 'OPERATIONS';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type VerificationStatus = 'UNREVIEWED' | 'CONFIRMED' | 'REJECTED' | 'FLAGGED';

export type ExtractionMethod = 
  | 'DETERMINISTIC_RULES'
  | 'GEMINI_EXTRACTION'
  | 'SPREADSHEET_PARSER'
  | 'OCR_PARSER'
  | 'MANUAL_OVERRIDE';

export type FactVerificationStatus = 
  | 'VERIFIED'
  | 'UNVERIFIED'
  | 'FAILED_VALIDATION'
  | 'UNKNOWN'
  | 'INSUFFICIENT_EVIDENCE';

export type TenderApiErrorCode = 
  | 'PROVIDER_FAILURE'
  | 'INVALID_MODEL_JSON'
  | 'INSUFFICIENT_EVIDENCE'
  | 'VALIDATION_FAILURE'
  | 'STALE_SOURCE_VERSION'
  | 'DOCUMENT_NOT_FOUND';

export interface TenderApiErrorPayload {
  error: string;
  code: TenderApiErrorCode;
  details?: Record<string, any>;
  timestamp: string;
}

export interface RetrievalCoverage {
  totalDocumentCharacters: number;
  retrievedCharacters: number;
  coveragePercent: number;
  totalSections: number;
  retrievedSections: number;
  truncatedSections: number;
  isFullyCovered: boolean;
  retrievalStrategy: 'SECTION_AWARE_BOUNDED' | 'FULL_TEXT';
}

export interface CitationValidationDetails {
  documentExists: boolean;
  matchedDocumentId?: string;
  sourceVersionMatched?: boolean;
  canonicalSourceVersion?: string;
  canonicalSha256?: string;
  versionCollisionRejected?: boolean;
  staleSourceVersion?: boolean;
  snippetFoundInSource: boolean;
  snippetMatchConfidence: number; // 1.0 for exact canonical match, 0.0 otherwise
  diagnosticTokenOverlap?: number; // diagnostic metric only, never considered authoritative verified evidence
  sourceSpanStart?: number | null;
  sourceSpanEnd?: number | null;
  rawCoordinatesProven?: boolean;
  normalizedMappingUsed?: boolean;
  pageVerified: boolean;
  pageNumberClaimed?: number | null;
  actualPageFound?: number | null;
  claimedPageMismatch?: boolean;
  pageRewritten?: boolean;
  originalClaimedPage?: number | null;
  rewrittenToPage?: number | null;
  boundaryUncertain?: boolean;
  failureReason?: string;
  verificationReason?: string;
  validatedAt: string;
  isQuarantined?: boolean;
}

export interface ClaimAssertion {
  claimId: string;
  statement: string;
  requirementKey?: string;
  requiredCitationsCount: number;
  citations: GroundedCitation[];
  isFullyCovered: boolean;
  unverifiedCitationsCount: number;
  quarantinedReason?: string;
}

export interface ClaimCoverageReport {
  totalClaims: number;
  coveredClaims: number;
  uncoveredClaims: number;
  claimLevelCoveragePercent: number;
  allClaimsGrounded: boolean;
  claims: ClaimAssertion[];
}

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'SNOOZED' | 'FLAGGED' | 'BLOCKED';

export interface GroundedCitation {
  documentId?: string;
  sourceDocumentId?: string; // Canonical immutable document ID
  sourceVersion?: string;    // Version label or content hash (e.g. 'v1.0')
  documentName: string;
  pageNumber?: number | null;
  pageOrNull?: number | null; // Canonical page number or strictly null/UNKNOWN
  isPageNumberExact?: boolean;
  sectionNumber?: string | null;
  sectionOrNull?: string | null;
  clauseTitle?: string | null;
  exactSnippet: string;
  sourceSpanStart?: number | null;
  sourceSpanEnd?: number | null;
  extractionMethod?: ExtractionMethod;
  verificationStatus?: FactVerificationStatus;
  verificationReason?: string;
  verifiedAt?: string;
  validationDetails?: CitationValidationDetails;
  isVerifiedAgainstSource?: boolean;
  matchConfidence?: number;
  diagnosticTokenOverlap?: number;
}

export interface DocumentPage {
  pageNumber: number;
  text: string;
  startOffset?: number;
  endOffset?: number;
  isUncertain?: boolean;
  sectionTitles?: string[];
}

export interface DocumentSection {
  id: string;
  sectionNumber: string;
  title: string;
  pageNumber: number | null;
  content: string;
  startOffset?: number;
  endOffset?: number;
}

export interface TenderDocument {
  id: string;
  tenderId: string;
  filename?: string;
  name: string;
  title?: string;
  type: DocumentType;
  versionNumber?: number;
  versionLabel: string;
  publishedDate?: string;
  publicationDate?: string;
  uploadedDate?: string;
  uploadDate?: string;
  pageCount: number;
  fileSizeBytes: number;
  sections?: DocumentSection[];
  pages?: DocumentPage[];
  extractedText?: string;
  summary?: string;
  rawTextSummary?: string;
  sha256Hash?: string;
  parsedStatus?: string;
  lifecycleStatus?: DocumentLifecycleStatus;
  classificationConfidence?: ConfidenceLevel;
  isClassificationConfirmedByUser?: boolean;
  isSequenceAmbiguous?: boolean;
  sequenceOrder?: number;
  provenance: ProvenanceType;
}

export interface MaterialChange {
  id: string;
  tenderId: string;
  category: RequirementCategory;
  changeType: ChangeType;
  materiality: MaterialityLevel;
  confidence: ConfidenceLevel;
  confidenceReason: string;
  title: string;
  requirementKey: string;
  originalText: string;
  updatedText: string;
  beforeValue?: string;
  afterValue?: string;
  impactExplanation: string;
  invalidatesText?: string;
  actionRequired: string;
  unresolvedAmbiguity?: string;
  sourceCitation: GroundedCitation;
  previousCitation?: GroundedCitation;
  sourceDocumentIdBefore?: string;
  sourceDocumentIdAfter?: string;
  sourcePageBefore?: number | null;
  sourcePageAfter?: number | null;
  sourceSnippetBefore?: string;
  sourceSnippetAfter?: string;
  isVerifiedAgainstSource?: boolean;
  factVsInterpretation?: 'FACT' | 'AI_INTERPRETATION' | 'RECOMMENDED_ACTION' | 'UNKNOWN' | 'CONFLICT';
  affectedDocuments: string[];
  relevantRoles: UserRoleView[];
  verificationStatus: VerificationStatus;
  extractionMethod?: ExtractionMethod;
  validationDetails?: CitationValidationDetails;
  isQuarantined?: boolean;
  userCorrectionNote?: string;
  assignedTaskId?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  auditNotes?: string;
  provenance?: ProvenanceType;
}

export interface StructuredRequirement {
  id: string;
  tenderId: string;
  key: string;
  category: RequirementCategory;
  title: string;
  originalValue: string;
  currentValue: string;
  hasChanged: boolean;
  mandatory: boolean;
  exactText?: string;
  normalizedValue?: {
    metric?: string;
    value?: number | string;
    currency?: string;
    unit?: string;
    period?: string;
    [key: string]: any;
  };
  sourceDocumentId?: string;
  sourceCitation: GroundedCitation;
  verificationStatus: VerificationStatus;
  ownerRole: UserRoleView;
  evidenceRequired: string;
  evidenceProvided: string;
  evidenceStatus: 'VERIFIED' | 'MISSING' | 'PENDING' | 'NOT_APPLICABLE';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'COMPLIANT' | 'NON_COMPLIANT' | 'ACTION_REQUIRED';
  provenance?: ProvenanceType;
}

export interface BOQItemChange {
  id: string;
  itemNumber: string;
  description: string;
  originalQuantity: number;
  revisedQuantity: number;
  unit: string;
  originalSpec: string;
  revisedSpec: string;
  percentageChange: number;
  changeType: 'QTY_INCREASED' | 'QTY_DECREASED' | 'NEW_ITEM' | 'REMOVED_ITEM' | 'SPEC_MODIFIED' | 'UNCHANGED';
  pricingImpactNotes: string;
  sourceCitation: GroundedCitation;
  provenance?: ProvenanceType;
}

export interface ConflictRecord {
  id: string;
  tenderId: string;
  title: string;
  category: RequirementCategory;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  statementA: {
    documentName: string;
    pageNumber?: number | null;
    clause: string;
    text: string;
  };
  statementB: {
    documentName: string;
    pageNumber?: number | null;
    clause: string;
    text: string;
  };
  conflictDescription: string;
  suggestedClarificationQuery: string;
  status: 'OPEN' | 'RESOLVED_BY_CORRIGENDUM' | 'CLARIFICATION_REQUESTED';
  provenance?: ProvenanceType;
}

export interface TenderDeadline {
  id: string;
  milestone: string;
  originalDate: string;
  currentDate: string;
  dateShiftDays: number;
  isExtended: boolean;
  sourceDocumentName: string;
  sourceCitation: GroundedCitation;
  timeRemainingDays: number;
  provenance?: ProvenanceType;
}

export interface ActionTask {
  id: string;
  tenderId?: string;
  changeId?: string;
  changeIdRef?: string;
  title: string;
  description: string;
  category?: RequirementCategory;
  ownerRole?: UserRoleView;
  role?: UserRoleView;
  assigneeName?: string;
  assignedTo?: string;
  dueDate: string;
  slaPolicyRule?: string;
  daysBeforeDeadline?: number;
  isStaleDeadline?: boolean;
  staleWarning?: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: TaskStatus;
  sourceCitation?: GroundedCitation;
  isAiGenerated?: boolean;
  confirmedByHuman?: boolean;
  completedAt?: string;
  createdAt?: string;
  notes?: string;
  provenance?: ProvenanceType;
}

export interface AuditEvent {
  id: string;
  tenderId: string;
  timestamp: string;
  action: string;
  user: string;
  role: string;
  details: string;
  category: 'INGESTION' | 'ANALYSIS' | 'VERIFICATION' | 'TASK' | 'EXPORT' | 'SETTINGS';
}

export interface RiskScoreBreakdown {
  baseScore: number;
  reasons: string[];
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  unresolvedConflictsCount: number;
}

export interface Tender {
  id: string;
  title: string;
  referenceNumber: string;
  organization: string;
  organizationType: 'CENTRAL_INSTITUTE' | 'PSU' | 'DEFENCE' | 'RAILWAYS' | 'STATE_GOVT' | 'CPWD' | 'AUTONOMOUS';
  portal: 'CPPP' | 'GeM' | 'IREPS' | 'STATE_EPROC' | 'CUSTOM';
  estimatedValueInr: number;
  currency: string;
  publishDate: string;
  originalSubmissionDeadline: string;
  currentSubmissionDeadline: string;
  preBidMeetingDate?: string;
  financialBidOpeningDate?: string;
  technicalBidOpeningDate?: string;
  currentVersion: string;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScoreReason: string;
  riskScoreBreakdown?: RiskScoreBreakdown;
  documents: TenderDocument[];
  changes: MaterialChange[];
  requirements: StructuredRequirement[];
  boqChanges: BOQItemChange[];
  conflicts: ConflictRecord[];
  deadlines: TenderDeadline[];
  tasks: ActionTask[];
  auditTrail: AuditEvent[];
  provenance: ProvenanceType;
  analysisMode?: AnalysisMode;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExecutiveSummaryReport {
  tenderId: string;
  title: string;
  generatedAt: string;
  versionSummary: string;
  totalDocuments: number;
  totalChanges: number;
  breakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
  };
  criticalTakeaways: string[];
  eligibilityImpacts: string[];
  deadlineShiftNotes: string[];
  technicalModifications: string[];
  commercialPricingImpacts: string[];
  newlyRequiredDocuments: string[];
  unresolvedContradictions: string[];
  mandatoryActionsSummary: string[];
}
