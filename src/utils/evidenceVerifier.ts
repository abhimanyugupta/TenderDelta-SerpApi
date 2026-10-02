import { DocumentPage, GroundedCitation } from '../types';

/**
 * Normalizes text for robust citation verification
 */
export function normalizeTextForSearch(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s₹$%-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface VerificationResult {
  isVerified: boolean;
  confidence: number;
  diagnosticTokenOverlap?: number;
  matchedPageNumber: number | null;
  isPageNumberExact: boolean;
  matchedSnippet: string;
}

/**
 * Verify whether a citation snippet is genuinely grounded in the document text
 */
export function verifyCitationGroundedness(
  snippet: string,
  docText: string,
  pages?: DocumentPage[]
): VerificationResult {
  if (!snippet || !docText) {
    return {
      isVerified: false,
      confidence: 0,
      matchedPageNumber: null,
      isPageNumberExact: false,
      matchedSnippet: ''
    };
  }

  const normSnippet = normalizeTextForSearch(snippet);
  const normDocText = normalizeTextForSearch(docText);

  if (normSnippet.length < 5) {
    return {
      isVerified: false,
      confidence: 0,
      matchedPageNumber: null,
      isPageNumberExact: false,
      matchedSnippet: ''
    };
  }

  // 1. Direct exact or normalized substring match
  if (docText.includes(snippet) || normDocText.includes(normSnippet)) {
    let matchedPageNumber: number | null = null;
    let isPageNumberExact = false;

    if (pages && pages.length > 0) {
      for (const p of pages) {
        const normPage = normalizeTextForSearch(p.text);
        if (p.text.includes(snippet) || normPage.includes(normSnippet)) {
          matchedPageNumber = p.isUncertain ? null : p.pageNumber;
          isPageNumberExact = !p.isUncertain;
          break;
        }
      }
    }

    return {
      isVerified: true,
      confidence: 1.0,
      matchedPageNumber,
      isPageNumberExact,
      matchedSnippet: snippet
    };
  }

  // 2. Sliding window token overlap match (for OCR / formatting differences)
  const snippetTokens = normSnippet.split(' ').filter(t => t.length > 2);
  if (snippetTokens.length >= 4) {
    let bestOverlap = 0;
    let bestPage: number | null = null;
    let bestPageExact = false;

    if (pages && pages.length > 0) {
      for (const p of pages) {
        const normPage = normalizeTextForSearch(p.text);
        let foundTokens = 0;
        for (const token of snippetTokens) {
          if (normPage.includes(token)) foundTokens++;
        }
        const overlap = foundTokens / snippetTokens.length;
        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          bestPage = p.isUncertain ? null : p.pageNumber;
          bestPageExact = !p.isUncertain;
        }
      }
    } else {
      let foundTokens = 0;
      for (const token of snippetTokens) {
        if (normDocText.includes(token)) foundTokens++;
      }
      bestOverlap = foundTokens / snippetTokens.length;
    }

    if (bestOverlap >= 0.70) {
      // ARCHITECTURAL MANDATE: Token overlap is diagnostic only and must NEVER mark isVerified = true.
      return {
        isVerified: false,
        confidence: 0,
        diagnosticTokenOverlap: Math.round(bestOverlap * 100) / 100,
        matchedPageNumber: null,
        isPageNumberExact: false,
        matchedSnippet: snippet
      };
    }
  }

  // Not found in document
  return {
    isVerified: false,
    confidence: 0,
    diagnosticTokenOverlap: 0,
    matchedPageNumber: null,
    isPageNumberExact: false,
    matchedSnippet: ''
  };
}

/**
 * Filter and tag a citation with verified source grounding
 */
export function groundCitation(
  citation: GroundedCitation,
  docText: string,
  pages?: DocumentPage[]
): GroundedCitation {
  const result = verifyCitationGroundedness(citation.exactSnippet, docText, pages);

  return {
    ...citation,
    pageNumber: result.matchedPageNumber !== null ? result.matchedPageNumber : (citation.pageNumber || null),
    isPageNumberExact: result.isPageNumberExact,
    isVerifiedAgainstSource: result.isVerified,
    matchConfidence: result.confidence
  };
}
