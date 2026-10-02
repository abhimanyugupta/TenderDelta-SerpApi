import { 
  GroundedCitation, 
  TenderDocument, 
  MaterialChange, 
  Tender, 
  CitationValidationDetails, 
  ExtractionMethod, 
  FactVerificationStatus,
  RetrievalCoverage,
  TenderApiErrorCode,
  TenderApiErrorPayload,
  ClaimAssertion,
  ClaimCoverageReport
} from '../types';

/**
 * Custom typed error class for TenderDelta API and evidence processing failures
 */
export class TenderApiError extends Error {
  public code: TenderApiErrorCode;
  public details?: Record<string, any>;
  public timestamp: string;

  constructor(code: TenderApiErrorCode, message: string, details?: Record<string, any>) {
    super(message);
    this.name = 'TenderApiError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toJSON(): TenderApiErrorPayload {
    return {
      error: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

/**
 * Normalizes text for robust snippet verification:
 * - Collapses repeated whitespace / newlines
 * - Normalizes Unicode punctuation & quotes
 * - Trims leading/trailing whitespace
 */
export function normalizeTextForSearch(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export interface NormalizedIndexMapResult {
  normalizedText: string;
  normToRawMap: number[];
}

/**
 * Builds a deterministic character-level mapping from normalized text offsets
 * back to original raw-text offsets.
 * 
 * ARCHITECTURAL DIRECTIVE 4:
 * If normalized-text matching is used, preserve a deterministic mapping from normalized
 * offsets back to canonical raw-text offsets before exposing sourceSpanStart/sourceSpanEnd.
 * If such mapping cannot be proven, return offsets UNKNOWN/null.
 */
export function buildNormalizedIndexMap(rawText: string): NormalizedIndexMapResult {
  if (!rawText) return { normalizedText: '', normToRawMap: [] };

  const normChars: string[] = [];
  const normToRawMap: number[] = [];

  let inWhitespaceSeq = false;
  let rawIndex = 0;

  // First skip leading whitespace in raw text
  while (rawIndex < rawText.length && /\s/.test(rawText[rawIndex])) {
    rawIndex++;
  }

  for (; rawIndex < rawText.length; rawIndex++) {
    const rawChar = rawText[rawIndex];

    if (/\s/.test(rawChar)) {
      if (!inWhitespaceSeq) {
        normChars.push(' ');
        normToRawMap.push(rawIndex);
        inWhitespaceSeq = true;
      }
    } else {
      inWhitespaceSeq = false;
      let mappedChar = rawChar.toLowerCase();
      if (/[\u2018\u2019\u201A\u201B]/.test(mappedChar)) mappedChar = "'";
      else if (/[\u201C\u201D\u201E\u201F]/.test(mappedChar)) mappedChar = '"';
      else if (/[\u2013\u2014]/.test(mappedChar)) mappedChar = '-';

      normChars.push(mappedChar);
      normToRawMap.push(rawIndex);
    }
  }

  // Trim trailing space if any
  if (normChars.length > 0 && normChars[normChars.length - 1] === ' ') {
    normChars.pop();
    normToRawMap.pop();
  }

  return {
    normalizedText: normChars.join(''),
    normToRawMap
  };
}

/**
 * Calculates token overlap similarity between snippet and text slice.
 * CRITICAL ARCHITECTURAL DIRECTIVE:
 * Token overlap is strictly a DIAGNOSTIC METRIC for logging and telemetry.
 * It is NEVER accepted as authoritative evidence for marked 'VERIFIED' status.
 */
export function calculateTokenOverlap(snippet: string, sourceText: string): number {
  const normSnippet = normalizeTextForSearch(snippet);
  const normSource = normalizeTextForSearch(sourceText);

  if (!normSnippet || !normSource) return 0;
  if (normSource.includes(normSnippet)) return 1.0;

  const snippetWords = normSnippet.split(' ').filter(w => w.length > 2);
  if (snippetWords.length === 0) return 0;

  let matchedWords = 0;
  for (const word of snippetWords) {
    if (normSource.includes(word)) {
      matchedWords++;
    }
  }

  return Number((matchedWords / snippetWords.length).toFixed(2));
}

export interface DocumentResolutionResult {
  document?: TenderDocument;
  resolvedById: boolean;
  versionMatched: boolean;
  canonicalSourceVersion?: string;
  canonicalSha256?: string;
  versionCollisionRejected?: boolean;
  staleSourceVersion?: boolean;
  failureReason?: string;
}

/**
 * Generates canonical exact version tokens for a document.
 * Explicitly rejects permissive substring matching (e.g. 'v1' inside 'v10').
 */
export function getCanonicalVersionTokens(doc: TenderDocument): string[] {
  const tokens = new Set<string>();

  if (doc.versionLabel) {
    const normLabel = doc.versionLabel.trim().toLowerCase();
    tokens.add(normLabel);

    // Extract version part like v1.0 or v10.0
    const m = normLabel.match(/v?(\d+(\.\d+)?)/i);
    if (m) {
      tokens.add(`v${m[1]}`);
      tokens.add(m[1]);
      const major = m[1].split('.')[0];
      tokens.add(`v${major}`);
      tokens.add(major);
    }
  }

  if (doc.versionNumber !== undefined) {
    tokens.add(`v${doc.versionNumber}`);
    tokens.add(`${doc.versionNumber}`);
    tokens.add(`v${doc.versionNumber}.0`);
    tokens.add(`${doc.versionNumber}.0`);
  }

  if (doc.sha256Hash) {
    tokens.add(doc.sha256Hash.toLowerCase());
  }

  return Array.from(tokens);
}

/**
 * Validates version identity using canonical exact identity semantics.
 * CRITICAL ARCHITECTURAL DIRECTIVE 5 & 6:
 * - Replace permissive `includes()` version matching with canonical exact identity semantics.
 * - Explicitly reject adversarial cases such as cited `v1` vs stored `v10`.
 * - Do not trust model-supplied sourceVersion as authoritative; compare only as a consistency check.
 */
export function isExactVersionMatch(
  citedVersion: string,
  doc: TenderDocument
): { matched: boolean; collisionRejected: boolean; reason?: string } {
  const normCited = citedVersion.trim().toLowerCase();
  const canonicalTokens = getCanonicalVersionTokens(doc);

  // 1. Direct exact match against any canonical token
  if (canonicalTokens.includes(normCited)) {
    return { matched: true, collisionRejected: false };
  }

  // 2. Adversarial v1 vs v10 collision check
  // If cited is v1 (or v1.x) and doc is v10 (or v10.x), ensure it is explicitly rejected
  const citedMajorMatch = normCited.match(/v?(\d+)/i);
  const docMajor = doc.versionNumber !== undefined ? doc.versionNumber : (doc.versionLabel?.match(/v?(\d+)/i)?.[1] ? parseInt(doc.versionLabel.match(/v?(\d+)/i)![1], 10) : undefined);

  if (citedMajorMatch && docMajor !== undefined) {
    const citedMajor = parseInt(citedMajorMatch[1], 10);
    if (citedMajor !== docMajor) {
      return {
        matched: false,
        collisionRejected: true,
        reason: `Version collision rejected: Cited version "${citedVersion}" (major ${citedMajor}) does not match document canonical version (major ${docMajor}, e.g. v1 vs v10 collision).`
      };
    }
  }

  // 3. Hash prefix check (minimum 12 hex characters required to avoid prefix collision)
  if (/^[a-f0-9]+$/i.test(normCited)) {
    if (normCited.length < 12) {
      return {
        matched: false,
        collisionRejected: true,
        reason: `Hash prefix too short: "${citedVersion}" (${normCited.length} chars). Minimum 12 hex characters required for canonical identity.`
      };
    }

    if (doc.sha256Hash && doc.sha256Hash.toLowerCase().startsWith(normCited)) {
      return { matched: true, collisionRejected: false };
    } else {
      return {
        matched: false,
        collisionRejected: false,
        reason: `Hash prefix mismatch: "${citedVersion}" does not match document sha256 hash "${doc.sha256Hash?.substring(0, 16)}...".`
      };
    }
  }

  return {
    matched: false,
    collisionRejected: false,
    reason: `Stale or mismatched document version: Cited sourceVersion "${citedVersion}" does not match canonical document version "${doc.versionLabel || (doc.versionNumber ? `v${doc.versionNumber}` : 'v1.0')}".`
  };
}

/**
 * Resolves an ingested document using STRICT AUTHORITATIVE IDENTITY (documentId/version).
 * 
 * FAIL-CLOSED SECURITY RULES:
 * 1. Never use fuzzy filename matching as authoritative identity.
 * 2. Resolve document by immutable documentId.
 * 3. Derive canonical sourceVersion and sha256 from resolved document.
 * 4. Compare model-provided sourceVersion only as a strict consistency check.
 */
export function resolveAuthoritativeDocument(
  citation: GroundedCitation,
  documents: TenderDocument[]
): DocumentResolutionResult {
  if (!documents || documents.length === 0) {
    return {
      document: undefined,
      resolvedById: false,
      versionMatched: false,
      failureReason: 'Document repository is empty. No ingested documents available.'
    };
  }

  const targetDocId = citation.sourceDocumentId || citation.documentId;

  // 1. Strict resolution by immutable documentId
  if (targetDocId) {
    const doc = documents.find(d => d.id === targetDocId);
    if (!doc) {
      return {
        document: undefined,
        resolvedById: false,
        versionMatched: false,
        failureReason: `Authoritative documentId "${targetDocId}" not found in ingested document repository. Fuzzy filename fallback is disabled to prevent citation spoofing.`
      };
    }

    const canonicalSourceVersion = doc.versionLabel || (doc.versionNumber !== undefined ? `v${doc.versionNumber}` : (doc.sha256Hash ? doc.sha256Hash.substring(0, 12) : 'v1.0'));
    const canonicalSha256 = doc.sha256Hash;

    // Check version consistency if citation specified sourceVersion
    if (citation.sourceVersion) {
      const verCheck = isExactVersionMatch(citation.sourceVersion, doc);
      if (!verCheck.matched) {
        return {
          document: doc,
          resolvedById: true,
          versionMatched: false,
          canonicalSourceVersion,
          canonicalSha256,
          versionCollisionRejected: verCheck.collisionRejected,
          staleSourceVersion: true,
          failureReason: verCheck.reason || `Stale document version: Cited "${citation.sourceVersion}" does not match repository canonical version "${canonicalSourceVersion}".`
        };
      }
    }

    return {
      document: doc,
      resolvedById: true,
      versionMatched: true,
      canonicalSourceVersion,
      canonicalSha256
    };
  }

  // 2. Fail closed if documentId is omitted or unspecified
  return {
    document: undefined,
    resolvedById: false,
    versionMatched: false,
    failureReason: `Missing authoritative documentId in citation. Citations must carry sourceDocumentId; fuzzy filename guessing is rejected.`
  };
}

/**
 * Deterministically validates a citation against the ingested document repository.
 * 
 * FAIL-CLOSED GUARANTEES:
 * 1. Resolves ONLY by stable source documentId + canonical exact version semantics.
 * 2. Requires exact source-span match in canonical text. Token overlap is purely diagnostic.
 * 3. Preserves deterministic mapping from normalized offsets back to canonical raw-text offsets before exposing coordinates. If mapping cannot be proven, returns offsets UNKNOWN/null.
 * 4. Verifies page numbers against stored page boundaries. If unavailable/uncertain, returns pageOrNull = null (UNKNOWN).
 *    If model-claimed page conflicts with authoritative page, deterministically rewrites citation to authoritative page and records correction.
 * 5. If validation fails, marks isQuarantined = true and verificationStatus = 'FAILED_VALIDATION'.
 */
export function validateGroundedCitation(
  citation: GroundedCitation,
  documents: TenderDocument[],
  defaultMethod: ExtractionMethod = 'GEMINI_EXTRACTION'
): GroundedCitation {
  const now = new Date().toISOString();
  const resolution = resolveAuthoritativeDocument(citation, documents);

  // Failure Case 1: Document not found by immutable ID or version mismatch
  if (!resolution.document || !resolution.versionMatched) {
    const failureReason = resolution.failureReason || 'Document resolution failed.';

    const validationDetails: CitationValidationDetails = {
      documentExists: Boolean(resolution.document),
      matchedDocumentId: resolution.document?.id,
      sourceVersionMatched: resolution.versionMatched,
      canonicalSourceVersion: resolution.canonicalSourceVersion,
      canonicalSha256: resolution.canonicalSha256,
      versionCollisionRejected: resolution.versionCollisionRejected,
      staleSourceVersion: resolution.staleSourceVersion,
      snippetFoundInSource: false,
      snippetMatchConfidence: 0,
      diagnosticTokenOverlap: 0,
      sourceSpanStart: null,
      sourceSpanEnd: null,
      rawCoordinatesProven: false,
      pageVerified: false,
      pageNumberClaimed: citation.pageNumber ?? citation.pageOrNull ?? null,
      actualPageFound: null,
      failureReason,
      verificationReason: `Quarantined: ${failureReason}`,
      validatedAt: now,
      isQuarantined: true
    };

    return {
      ...citation,
      sourceDocumentId: resolution.document?.id || citation.sourceDocumentId || citation.documentId,
      documentId: resolution.document?.id || citation.documentId,
      sourceVersion: resolution.canonicalSourceVersion || citation.sourceVersion,
      pageNumber: null,
      pageOrNull: null,
      sectionOrNull: null,
      sourceSpanStart: null,
      sourceSpanEnd: null,
      extractionMethod: citation.extractionMethod || defaultMethod,
      verificationStatus: 'FAILED_VALIDATION',
      verificationReason: failureReason,
      isVerifiedAgainstSource: false,
      matchConfidence: 0,
      diagnosticTokenOverlap: 0,
      validationDetails,
      verifiedAt: now
    };
  }

  const doc = resolution.document;
  const rawSnippet = citation.exactSnippet || '';
  const pagesJoinedText = (doc.pages && doc.pages.length > 0) ? doc.pages.map(p => p.text).join('\n') : '';
  let canonicalDocText = doc.extractedText || pagesJoinedText;
  if (pagesJoinedText && (
    !canonicalDocText || 
    (!canonicalDocText.includes(rawSnippet) && pagesJoinedText.includes(rawSnippet)) ||
    (!normalizeTextForSearch(canonicalDocText).includes(normalizeTextForSearch(rawSnippet)) && normalizeTextForSearch(pagesJoinedText).includes(normalizeTextForSearch(rawSnippet)))
  )) {
    canonicalDocText = pagesJoinedText;
  }

  // Failure Case 2: Empty snippet
  if (!rawSnippet.trim()) {
    const failureReason = 'Citation contains an empty snippet string.';
    const validationDetails: CitationValidationDetails = {
      documentExists: true,
      matchedDocumentId: doc.id,
      sourceVersionMatched: true,
      canonicalSourceVersion: resolution.canonicalSourceVersion,
      canonicalSha256: resolution.canonicalSha256,
      snippetFoundInSource: false,
      snippetMatchConfidence: 0,
      diagnosticTokenOverlap: 0,
      sourceSpanStart: null,
      sourceSpanEnd: null,
      rawCoordinatesProven: false,
      pageVerified: false,
      pageNumberClaimed: citation.pageNumber ?? citation.pageOrNull ?? null,
      actualPageFound: null,
      failureReason,
      verificationReason: `Quarantined: ${failureReason}`,
      validatedAt: now,
      isQuarantined: true
    };

    return {
      ...citation,
      sourceDocumentId: doc.id,
      documentId: doc.id,
      documentName: doc.filename || doc.name,
      sourceVersion: resolution.canonicalSourceVersion,
      pageNumber: null,
      pageOrNull: null,
      sourceSpanStart: null,
      sourceSpanEnd: null,
      extractionMethod: citation.extractionMethod || defaultMethod,
      verificationStatus: 'FAILED_VALIDATION',
      verificationReason: failureReason,
      isVerifiedAgainstSource: false,
      matchConfidence: 0,
      diagnosticTokenOverlap: 0,
      validationDetails,
      verifiedAt: now
    };
  }

  // Exact Span Search in Canonical Source
  let spanStart: number | null = null;
  let spanEnd: number | null = null;
  let rawCoordinatesProven = false;
  let normalizedMappingUsed = false;

  // Step 1: Check verbatim in raw canonical text first
  const rawIndex = canonicalDocText.indexOf(rawSnippet);
  if (rawIndex !== -1) {
    spanStart = rawIndex;
    spanEnd = rawIndex + rawSnippet.length;
    rawCoordinatesProven = true;
    normalizedMappingUsed = false;
  } else {
    // Step 2: If whitespace/casing normalization was needed, build character-level map
    const normSnippet = normalizeTextForSearch(rawSnippet);
    const { normalizedText, normToRawMap } = buildNormalizedIndexMap(canonicalDocText);
    const normIndex = normalizedText.indexOf(normSnippet);

    if (normIndex !== -1 && normSnippet.length > 0) {
      normalizedMappingUsed = true;
      const mappedRawStart = normToRawMap[normIndex];
      const mappedRawEndCharIdx = normToRawMap[normIndex + normSnippet.length - 1];
      const mappedRawEnd = mappedRawEndCharIdx !== undefined ? mappedRawEndCharIdx + 1 : undefined;

      if (mappedRawStart !== undefined && mappedRawEnd !== undefined && mappedRawEnd > mappedRawStart) {
        const rawSlice = canonicalDocText.substring(mappedRawStart, mappedRawEnd);
        // Verify provenance of coordinate mapping: Does normalized slice equal normalized snippet?
        if (normalizeTextForSearch(rawSlice) === normSnippet) {
          spanStart = mappedRawStart;
          spanEnd = mappedRawEnd;
          rawCoordinatesProven = true;
        } else {
          // Mapping cannot be proven unambiguously; return offsets UNKNOWN/null
          spanStart = null;
          spanEnd = null;
          rawCoordinatesProven = false;
        }
      } else {
        spanStart = null;
        spanEnd = null;
        rawCoordinatesProven = false;
      }
    }
  }

  const exactFound = (spanStart !== null && spanEnd !== null) || (normalizeTextForSearch(canonicalDocText).includes(normalizeTextForSearch(rawSnippet)));
  const diagnosticOverlap = calculateTokenOverlap(rawSnippet, canonicalDocText);

  // Failure Case 3: Exact snippet does NOT occur in canonical source span
  // Token overlap is strictly diagnostic and cannot yield VERIFIED status
  if (!exactFound) {
    const failureReason = `Cited snippet does not occur verbatim in source document "${doc.name}" (${doc.id}). Diagnostic token overlap is ${(diagnosticOverlap * 100).toFixed(1)}% (diagnostic only, cannot be verified). High-similarity killer mismatch or fabricated clause.`;

    const validationDetails: CitationValidationDetails = {
      documentExists: true,
      matchedDocumentId: doc.id,
      sourceVersionMatched: true,
      canonicalSourceVersion: resolution.canonicalSourceVersion,
      canonicalSha256: resolution.canonicalSha256,
      snippetFoundInSource: false,
      snippetMatchConfidence: 0,
      diagnosticTokenOverlap: diagnosticOverlap,
      sourceSpanStart: null,
      sourceSpanEnd: null,
      rawCoordinatesProven: false,
      pageVerified: false,
      pageNumberClaimed: citation.pageNumber ?? citation.pageOrNull ?? null,
      actualPageFound: null,
      failureReason,
      verificationReason: `Quarantined: ${failureReason}`,
      validatedAt: now,
      isQuarantined: true
    };

    return {
      ...citation,
      sourceDocumentId: doc.id,
      documentId: doc.id,
      documentName: doc.filename || doc.name,
      sourceVersion: resolution.canonicalSourceVersion,
      pageNumber: null,
      pageOrNull: null,
      sourceSpanStart: null,
      sourceSpanEnd: null,
      extractionMethod: citation.extractionMethod || defaultMethod,
      verificationStatus: 'FAILED_VALIDATION',
      verificationReason: failureReason,
      isVerifiedAgainstSource: false,
      matchConfidence: 0,
      diagnosticTokenOverlap: diagnosticOverlap,
      validationDetails,
      verifiedAt: now
    };
  }

  // SUCCESS CASE: Exact snippet found in canonical document span
  // Now verify page boundaries strictly
  let actualPageFound: number | null = null;
  let isPageVerified = false;
  let claimedPageMismatch = false;
  let pageRewritten = false;
  let boundaryUncertain = false;
  const claimedPage = citation.pageOrNull !== undefined ? citation.pageOrNull : (citation.pageNumber ?? null);
  const normSnippet = normalizeTextForSearch(rawSnippet);

  if (doc.pages && doc.pages.length > 0) {
    // 1. Check if snippet is on claimed page
    if (claimedPage !== null && claimedPage > 0) {
      const pageObj = doc.pages.find(p => p.pageNumber === claimedPage);
      if (pageObj) {
        if (pageObj.isUncertain) {
          boundaryUncertain = true;
        } else if (normalizeTextForSearch(pageObj.text).includes(normSnippet)) {
          actualPageFound = claimedPage;
          isPageVerified = true;
        }
      }
    }

    // 2. If not verified on claimed page, scan all pages to locate actual boundary
    if (!isPageVerified) {
      for (const page of doc.pages) {
        if (normalizeTextForSearch(page.text).includes(normSnippet)) {
          if (page.isUncertain) {
            boundaryUncertain = true;
          } else {
            actualPageFound = page.pageNumber;
            isPageVerified = true;
            if (claimedPage !== null && claimedPage !== actualPageFound) {
              claimedPageMismatch = true;
              pageRewritten = true;
            }
          }
          break;
        }
      }
    }
  } else {
    // Document is unpaginated (e.g. raw text stream or pageCount: 0)
    boundaryUncertain = true;
  }

  // If page boundary is unverified, document is unpaginated, or marked uncertain:
  // Strictly return pageOrNull = null (UNKNOWN), never guess
  const finalPageNumber = isPageVerified && !boundaryUncertain ? actualPageFound : null;

  // Resolve section boundary if available
  let sectionOrNull: string | null = citation.sectionOrNull || citation.sectionNumber || null;
  if (doc.sections && doc.sections.length > 0) {
    const matchingSection = doc.sections.find(s => 
      normalizeTextForSearch(s.content).includes(normSnippet) ||
      (s.pageNumber !== null && s.pageNumber === finalPageNumber)
    );
    if (matchingSection) {
      sectionOrNull = matchingSection.sectionNumber;
    }
  }

  let verificationReason = '';
  if (pageRewritten && finalPageNumber !== null) {
    verificationReason = `Deterministic page rewrite: Claimed page ${claimedPage} corrected to authoritative page ${finalPageNumber} in ${doc.id} (offsets [${spanStart ?? 'UNKNOWN'}, ${spanEnd ?? 'UNKNOWN'}]).`;
  } else if (isPageVerified && finalPageNumber !== null) {
    verificationReason = `Exact source span verified in ${doc.id} (Page ${finalPageNumber}, offsets [${spanStart ?? 'UNKNOWN'}, ${spanEnd ?? 'UNKNOWN'}]).`;
  } else {
    verificationReason = `Exact source span verified in ${doc.id} (Page UNKNOWN - unpaginated or span boundary uncertain, offsets [${spanStart ?? 'UNKNOWN'}, ${spanEnd ?? 'UNKNOWN'}]).`;
  }

  const validationDetails: CitationValidationDetails = {
    documentExists: true,
    matchedDocumentId: doc.id,
    sourceVersionMatched: true,
    canonicalSourceVersion: resolution.canonicalSourceVersion,
    canonicalSha256: resolution.canonicalSha256,
    snippetFoundInSource: true,
    snippetMatchConfidence: 1.0,
    diagnosticTokenOverlap: 1.0,
    sourceSpanStart: spanStart,
    sourceSpanEnd: spanEnd,
    rawCoordinatesProven,
    normalizedMappingUsed,
    pageVerified: isPageVerified && !boundaryUncertain,
    pageNumberClaimed: claimedPage,
    actualPageFound: finalPageNumber,
    claimedPageMismatch,
    pageRewritten,
    originalClaimedPage: claimedPage,
    rewrittenToPage: finalPageNumber,
    boundaryUncertain,
    verificationReason,
    validatedAt: now,
    isQuarantined: false
  };

  return {
    ...citation,
    sourceDocumentId: doc.id,
    sourceVersion: resolution.canonicalSourceVersion,
    documentId: doc.id,
    documentName: doc.filename || doc.name,
    pageNumber: finalPageNumber,
    pageOrNull: finalPageNumber,
    sectionNumber: sectionOrNull,
    sectionOrNull,
    sourceSpanStart: spanStart,
    sourceSpanEnd: spanEnd,
    extractionMethod: citation.extractionMethod || defaultMethod,
    verificationStatus: 'VERIFIED',
    verificationReason,
    isVerifiedAgainstSource: true,
    matchConfidence: 1.0,
    diagnosticTokenOverlap: 1.0,
    validationDetails,
    verifiedAt: now
  };
}

/**
 * Enforces claim-level citation coverage:
 * Every material factual assertion must have at least one independently verified source citation.
 * If any citation fails validation, the claim is marked unverified/quarantined.
 */
export function evaluateClaimCitationCoverage(
  assertions: ClaimAssertion[],
  documents: TenderDocument[]
): ClaimCoverageReport {
  let coveredCount = 0;
  const processedClaims: ClaimAssertion[] = [];

  for (const claim of assertions) {
    const validatedCitations = claim.citations.map(c => validateGroundedCitation(c, documents));
    const verifiedCitations = validatedCitations.filter(c => c.verificationStatus === 'VERIFIED');
    const failedCitations = validatedCitations.filter(c => c.verificationStatus === 'FAILED_VALIDATION');

    const isFullyCovered = verifiedCitations.length >= Math.max(1, claim.requiredCitationsCount) && failedCitations.length === 0;

    let quarantinedReason: string | undefined = undefined;
    if (failedCitations.length > 0) {
      quarantinedReason = `Claim quarantined: ${failedCitations.length} citation(s) failed verification: ${failedCitations[0].validationDetails?.failureReason}`;
    } else if (verifiedCitations.length < claim.requiredCitationsCount) {
      quarantinedReason = `Insufficient citation coverage: Requires ${claim.requiredCitationsCount} verified citation(s), but only ${verifiedCitations.length} verified.`;
    }

    if (isFullyCovered) {
      coveredCount++;
    }

    processedClaims.push({
      ...claim,
      citations: validatedCitations,
      isFullyCovered,
      unverifiedCitationsCount: failedCitations.length,
      quarantinedReason
    });
  }

  const totalClaims = assertions.length;
  const claimLevelCoveragePercent = totalClaims > 0 ? Number(((coveredCount / totalClaims) * 100).toFixed(1)) : 100;
  const allClaimsGrounded = totalClaims > 0 && coveredCount === totalClaims;

  return {
    totalClaims,
    coveredClaims: coveredCount,
    uncoveredClaims: totalClaims - coveredCount,
    claimLevelCoveragePercent,
    allClaimsGrounded,
    claims: processedClaims
  };
}

/**
 * Validates a MaterialChange and its citations with fail-closed quarantine.
 */
export function validateMaterialChange(
  change: MaterialChange,
  documents: TenderDocument[]
): MaterialChange {
  const validatedCitation = validateGroundedCitation(
    change.sourceCitation, 
    documents, 
    change.extractionMethod || 'DETERMINISTIC_RULES'
  );

  let validatedPrevCitation = change.previousCitation;
  if (change.previousCitation) {
    validatedPrevCitation = validateGroundedCitation(
      change.previousCitation, 
      documents, 
      change.extractionMethod || 'DETERMINISTIC_RULES'
    );
  }

  const isFailed = validatedCitation.verificationStatus === 'FAILED_VALIDATION' ||
    (validatedPrevCitation && validatedPrevCitation.verificationStatus === 'FAILED_VALIDATION');

  return {
    ...change,
    sourceCitation: validatedCitation,
    previousCitation: validatedPrevCitation,
    extractionMethod: validatedCitation.extractionMethod,
    verificationStatus: isFailed ? 'REJECTED' : 'CONFIRMED',
    isVerifiedAgainstSource: !isFailed,
    isQuarantined: isFailed,
    validationDetails: validatedCitation.validationDetails
  };
}

/**
 * Revalidates precomputed or cached records against current document repository versions.
 * If any citation fails validation, downgrades confidence and quarantines the record.
 * (Directive 12: For structured precomputed records, revalidate their citations against current document version before returning HIGH confidence)
 */
export function revalidateStructuredRecord<T extends { sourceCitation?: GroundedCitation; confidence?: any; isQuarantined?: boolean }>(
  record: T,
  documents: TenderDocument[]
): T & { revalidated: boolean; confidence: any } {
  if (!record.sourceCitation) {
    return { ...record, revalidated: true, confidence: 'LOW', isQuarantined: true };
  }

  const validatedCit = validateGroundedCitation(record.sourceCitation, documents);
  const isValid = validatedCit.verificationStatus === 'VERIFIED';

  return {
    ...record,
    sourceCitation: validatedCit,
    confidence: isValid ? (record.confidence || 'HIGH') : 'LOW',
    isQuarantined: !isValid,
    revalidated: true
  };
}

/**
 * Bounded, source-aware retrieval that preserves page/section boundaries
 * and reports exact retrieval coverage metrics.
 * 
 * Replaces arbitrary character truncation with structured slices.
 */
export function retrieveBoundedSourceContext(
  documents: TenderDocument[],
  options: {
    characterBudget?: number;
    queryKeywords?: string[];
    roleFilter?: string;
  } = {}
): {
  formattedContext: string;
  coverage: RetrievalCoverage;
} {
  const budget = options.characterBudget || 18000;
  let accumulatedChars = 0;
  let retrievedTextChars = 0;
  let totalDocChars = 0;
  let totalSectionsCount = 0;
  let retrievedSectionsCount = 0;
  let truncatedSectionsCount = 0;

  const parts: string[] = [];

  for (const doc of documents) {
    const docFullText = doc.extractedText || (doc.pages ? doc.pages.map(p => p.text).join('\n') : '');
    totalDocChars += docFullText.length;
    const docSections = doc.sections || [];
    totalSectionsCount += Math.max(docSections.length, 1);

    const docHeader = `<untrusted_tender_document id="${doc.id}" version="${doc.versionLabel || 'v1.0'}" filename="${doc.filename || doc.name}" type="${doc.type}">`;
    const docFooter = `</untrusted_tender_document>`;
    accumulatedChars += docHeader.length + docFooter.length;

    const docBodyParts: string[] = [];

    if (docSections.length > 0) {
      for (const sec of docSections) {
        const secHeader = `  <section id="${sec.id}" number="${sec.sectionNumber}" page="${sec.pageNumber !== null ? sec.pageNumber : 'UNKNOWN'}" title="${sec.title}">`;
        const secFooter = `  </section>`;
        const overhead = secHeader.length + secFooter.length + 4;

        const remainingBudget = budget - accumulatedChars;
        if (remainingBudget <= overhead + 50) {
          truncatedSectionsCount++;
          continue;
        }

        const maxContentLen = remainingBudget - overhead;
        const willTruncate = sec.content.length > maxContentLen;
        const slice = willTruncate ? sec.content.substring(0, maxContentLen) + ' ... [SECTION BUDGET LIMIT REACHED]' : sec.content;

        if (willTruncate) truncatedSectionsCount++;
        retrievedSectionsCount++;

        retrievedTextChars += slice.length;
        accumulatedChars += slice.length + overhead;
        docBodyParts.push(`${secHeader}\n${slice}\n${secFooter}`);

        if (accumulatedChars >= budget) break;
      }
    } else if (doc.pages && doc.pages.length > 0) {
      for (const page of doc.pages) {
        const pHeader = `  <page number="${page.isUncertain ? 'UNKNOWN' : page.pageNumber}">`;
        const pFooter = `  </page>`;
        const overhead = pHeader.length + pFooter.length + 4;

        const remainingBudget = budget - accumulatedChars;
        if (remainingBudget <= overhead + 50) {
          truncatedSectionsCount++;
          continue;
        }

        const maxContentLen = remainingBudget - overhead;
        const willTruncate = page.text.length > maxContentLen;
        const slice = willTruncate ? page.text.substring(0, maxContentLen) + ' ... [PAGE BUDGET LIMIT REACHED]' : page.text;

        if (willTruncate) truncatedSectionsCount++;
        retrievedSectionsCount++;

        retrievedTextChars += slice.length;
        accumulatedChars += slice.length + overhead;
        docBodyParts.push(`${pHeader}\n${slice}\n${pFooter}`);

        if (accumulatedChars >= budget) break;
      }
    } else {
      // Unpaginated plain text
      const remainingBudget = budget - accumulatedChars;
      const willTruncate = docFullText.length > remainingBudget;
      const slice = willTruncate ? docFullText.substring(0, Math.max(0, remainingBudget)) + ' ... [BUDGET LIMIT REACHED]' : docFullText;

      retrievedSectionsCount++;
      if (willTruncate) truncatedSectionsCount++;
      retrievedTextChars += slice.length;
      accumulatedChars += slice.length;
      docBodyParts.push(slice);
    }

    parts.push(`${docHeader}\n${docBodyParts.join('\n')}\n${docFooter}`);
    if (accumulatedChars >= budget) break;
  }

  let coveragePercent = totalDocChars > 0 ? Number(Math.min(100, (retrievedTextChars / totalDocChars) * 100).toFixed(1)) : 100;
  if (truncatedSectionsCount > 0 && coveragePercent >= 100) {
    coveragePercent = Math.min(95.0, Number(((retrievedSectionsCount - truncatedSectionsCount) / Math.max(1, retrievedSectionsCount) * 100).toFixed(1)));
  }

  const coverage: RetrievalCoverage = {
    totalDocumentCharacters: totalDocChars,
    retrievedCharacters: accumulatedChars,
    coveragePercent,
    totalSections: totalSectionsCount,
    retrievedSections: retrievedSectionsCount,
    truncatedSections: truncatedSectionsCount,
    isFullyCovered: coveragePercent >= 99.5 && truncatedSectionsCount === 0,
    retrievalStrategy: 'SECTION_AWARE_BOUNDED'
  };

  return {
    formattedContext: parts.join('\n\n'),
    coverage
  };
}

/**
 * Validates all facts in a Tender and updates the audit trail.
 */
export function validateAllTenderFacts(tender: Tender): {
  validatedTender: Tender;
  verifiedCount: number;
  failedCount: number;
  quarantinedCount: number;
  log: string[];
} {
  const docs = tender.documents || [];
  const log: string[] = [];
  let verifiedCount = 0;
  let failedCount = 0;
  let quarantinedCount = 0;

  // 1. Validate Material Changes
  const validatedChanges = (tender.changes || []).map(change => {
    const validated = validateMaterialChange(change, docs);
    if (validated.isQuarantined) {
      failedCount++;
      quarantinedCount++;
      log.push(`[QUARANTINED] Change "${change.title}": ${validated.validationDetails?.failureReason}`);
    } else {
      verifiedCount++;
    }
    return validated;
  });

  // 2. Validate Requirements
  const validatedReqs = (tender.requirements || []).map(req => {
    if (!req.sourceCitation) return req;
    const valCitation = validateGroundedCitation(req.sourceCitation, docs, 'DETERMINISTIC_RULES');
    return {
      ...req,
      sourceCitation: valCitation,
      verificationStatus: valCitation.verificationStatus === 'FAILED_VALIDATION' ? 'REJECTED' as const : 'CONFIRMED' as const
    };
  });

  // 3. Generate Audit Trail entry if validations were performed
  const newAuditEvents = [...(tender.auditTrail || [])];
  if (failedCount > 0) {
    newAuditEvents.push({
      id: `audit-${Date.now()}-val-fail`,
      tenderId: tender.id,
      timestamp: new Date().toISOString(),
      action: 'EVIDENCE_CHAIN_VALIDATION_WARNING',
      user: 'Deterministic Citation Validator',
      role: 'SYSTEM',
      details: `Detected ${failedCount} fact(s) failing grounded source verification. Quarantined from verified compliance reports.`,
      category: 'VERIFICATION'
    });
  } else {
    newAuditEvents.push({
      id: `audit-${Date.now()}-val-pass`,
      tenderId: tender.id,
      timestamp: new Date().toISOString(),
      action: 'EVIDENCE_CHAIN_VALIDATED',
      user: 'Deterministic Citation Validator',
      role: 'SYSTEM',
      details: `Verified ${verifiedCount} fact(s) against ingested document corpus. 100% grounded in source text.`,
      category: 'VERIFICATION'
    });
  }

  return {
    validatedTender: {
      ...tender,
      changes: validatedChanges,
      requirements: validatedReqs,
      auditTrail: newAuditEvents
    },
    verifiedCount,
    failedCount,
    quarantinedCount,
    log
  };
}
