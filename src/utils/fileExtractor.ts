import * as XLSX from 'xlsx';
import { DocumentPage, DocumentSection, DocumentType, ConfidenceLevel } from '../types';

export interface StructuredBOQRow {
  sheet: string;
  rowIndex: number;
  itemNumber: string;
  description: string;
  quantity: number | null;
  unit: string;
  rate: number | null;
  amount: number | null;
  rawText: string;
}

export interface ExtractedFileResult {
  filename: string;
  fileSizeBytes: number;
  fileType: DocumentType;
  classificationConfidence: ConfidenceLevel;
  pageCount: number;
  isPageCountExact: boolean;
  extractedText: string;
  pages: DocumentPage[];
  sections: DocumentSection[];
  boqRows?: StructuredBOQRow[];
  sha256Hash: string;
  summary: string;
}

/**
 * Calculate genuine SHA-256 hash using Web Crypto API
 */
export async function calculateSHA256(buffer: ArrayBuffer): Promise<string> {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn('Web Crypto SHA-256 unavailable', e);
  }
  return '';
}

/**
 * First-pass classifier based on filename and extracted text
 */
export function detectDocumentType(filename: string, textSample: string): { type: DocumentType; confidence: ConfidenceLevel; reason: string } {
  const lowerName = filename.toLowerCase();
  const lowerText = (textSample || '').toLowerCase();

  // 1. BOQ / Schedule of Rates
  if (lowerName.includes('boq') || lowerName.includes('schedule') || lowerName.includes('rates') || lowerName.includes('sor') || lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls') || lowerName.endsWith('.csv')) {
    if (lowerName.includes('revised') || lowerName.includes('corr') || lowerName.includes('v2') || lowerName.includes('v3') || lowerText.includes('revised schedule') || lowerText.includes('revised boq')) {
      return { type: 'REVISED_BOQ', confidence: 'HIGH', reason: 'Filename or content indicates Revised BOQ / Schedule of Rates' };
    }
    return { type: 'BOQ', confidence: 'HIGH', reason: 'Spreadsheet or pricing schedule detected' };
  }

  // 2. Corrigenda / Amendments
  if (lowerName.includes('corr') || lowerName.includes('amend') || lowerName.includes('rectification') || lowerText.includes('corrigendum') || lowerText.includes('amendment no') || lowerText.includes('substantive amendment')) {
    return { type: 'CORRIGENDUM', confidence: 'HIGH', reason: 'Corrigendum / amendment keywords identified' };
  }

  // 3. Pre-Bid Clarifications
  if (lowerName.includes('prebid') || lowerName.includes('pre-bid') || lowerName.includes('clarification') || lowerName.includes('reply') || lowerText.includes('pre-bid meeting') || lowerText.includes('reply to queries') || lowerText.includes('query #') || lowerText.includes('clarification query')) {
    return { type: 'PRE_BID_CLARIFICATION', confidence: 'HIGH', reason: 'Pre-bid clarification / bidder query matrix format detected' };
  }

  // 4. Addenda
  if (lowerName.includes('addendum') || lowerText.includes('addendum no') || lowerText.includes('addenda')) {
    return { type: 'ADDENDUM', confidence: 'HIGH', reason: 'Addendum keywords identified' };
  }

  // 5. Technical Specifications
  if (lowerName.includes('tech') || lowerName.includes('spec') || lowerText.includes('technical specifications') || lowerText.includes('scope of work') || lowerText.includes('bill of materials')) {
    return { type: 'TECHNICAL_SPEC', confidence: 'MEDIUM', reason: 'Technical specification / scope of work patterns' };
  }

  // 6. Commercial / GCC / SCC
  if (lowerName.includes('gcc') || lowerName.includes('scc') || lowerName.includes('commercial') || lowerText.includes('general conditions of contract') || lowerText.includes('special conditions of contract')) {
    return { type: 'COMMERCIAL_CONDITIONS', confidence: 'MEDIUM', reason: 'General / Special Commercial conditions' };
  }

  // 7. Original NIT / RFP
  if (lowerName.includes('nit') || lowerName.includes('tender') || lowerName.includes('rfp') || lowerText.includes('notice inviting tender') || lowerText.includes('request for proposal') || lowerText.includes('invitation for bids')) {
    return { type: 'ORIGINAL_NIT', confidence: 'HIGH', reason: 'Primary Notice Inviting Tender (NIT) keywords' };
  }

  // 8. Annexures
  if (lowerName.includes('annex') || lowerText.includes('annexure') || lowerText.includes('undertaking format')) {
    return { type: 'ANNEXURE', confidence: 'MEDIUM', reason: 'Tender annexure / forms document' };
  }

  return { type: 'OTHER', confidence: 'LOW', reason: 'Unclassified procurement document' };
}

/**
 * Extract text from PDF buffer with honest page boundary tracking
 */
function extractTextFromPdfBuffer(buffer: ArrayBuffer): { text: string; pages: DocumentPage[]; isPageCountExact: boolean } {
  try {
    const uint8 = new Uint8Array(buffer);
    let binaryString = '';
    const chunkSize = 8192;
    for (let i = 0; i < uint8.length; i += chunkSize) {
      const chunk = uint8.subarray(i, Math.min(i + chunkSize, uint8.length));
      binaryString += String.fromCharCode.apply(null, Array.from(chunk));
    }

    const pages: DocumentPage[] = [];
    const streamRegex = /stream[\r\n]+([\s\S]*?)endstream/g;
    let match: RegExpExecArray | null;
    const textBlocks: string[] = [];

    while ((match = streamRegex.exec(binaryString)) !== null) {
      const streamContent = match[1];
      const tjRegex = /\(([^)]+)\)\s*Tj/g;
      let tjMatch: RegExpExecArray | null;
      let streamText = '';

      while ((tjMatch = tjRegex.exec(streamContent)) !== null) {
        let clean = tjMatch[1]
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\b/g, '\b')
          .replace(/\\f/g, '\f')
          .replace(/\\\(/g, '(')
          .replace(/\\\)/g, ')')
          .replace(/\\\\/g, '\\');
        streamText += clean + ' ';
      }

      const bracketRegex = /\[([^\]]+)\]\s*TJ/g;
      let bMatch: RegExpExecArray | null;
      while ((bMatch = bracketRegex.exec(streamContent)) !== null) {
        const inner = bMatch[1];
        const innerStrRegex = /\(([^)]+)\)/g;
        let strMatch: RegExpExecArray | null;
        while ((strMatch = innerStrRegex.exec(inner)) !== null) {
          streamText += strMatch[1] + ' ';
        }
      }

      if (streamText.trim().length > 10) {
        textBlocks.push(streamText.trim());
      }
    }

    let fullText = '';
    if (textBlocks.length > 0) {
      fullText = textBlocks.join('\n\n');
    } else {
      fullText = '';
    }

    // Check if explicit page breaks (form feeds or Page markers) exist
    const explicitPages = fullText.split(/\f|\n(?=Page\s+\d+\s+of|\bPage\s*:\s*\d+)/i);
    if (explicitPages.length > 1) {
      explicitPages.forEach((pText, idx) => {
        if (pText.trim().length > 0) {
          pages.push({
            pageNumber: idx + 1,
            text: pText.trim(),
            isUncertain: false
          });
        }
      });
      return { text: fullText, pages, isPageCountExact: true };
    }

    // If page boundaries cannot be determined with certainty, preserve text without fake page claims
    if (fullText.trim().length > 0) {
      pages.push({
        pageNumber: 1,
        text: fullText.trim(),
        isUncertain: true // Explicitly marks that exact page demarcation is unverified
      });
      return { text: fullText, pages, isPageCountExact: false };
    }

    return {
      text: '',
      pages: [],
      isPageCountExact: false
    };
  } catch (err) {
    console.warn('PDF extraction error', err);
    return {
      text: '',
      pages: [],
      isPageCountExact: false
    };
  }
}

/**
 * Extract structured rows and cells from Excel / CSV files
 */
function extractFromSpreadsheet(buffer: ArrayBuffer, filename: string): { 
  text: string; 
  pages: DocumentPage[]; 
  boqRows: StructuredBOQRow[]; 
  isPageCountExact: boolean 
} {
  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const pages: DocumentPage[] = [];
    const textSegments: string[] = [];
    const boqRows: StructuredBOQRow[] = [];

    workbook.SheetNames.forEach((sheetName, index) => {
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      let formattedTable = `=== SHEET: ${sheetName} ===\n`;

      json.forEach((row, rowIdx) => {
        if (row && row.length > 0) {
          const rowStr = row.filter(c => c !== undefined && c !== '').join(' | ');
          formattedTable += `Row ${rowIdx + 1}: ${rowStr}\n`;

          // Try to parse structured BOQ columns
          let itemNumber = '';
          let description = '';
          let quantity: number | null = null;
          let unit = '';
          let rate: number | null = null;
          let amount: number | null = null;

          // Find first column containing item number or serial number
          for (let col = 0; col < row.length; col++) {
            const cell = String(row[col] || '').trim();
            if (!itemNumber && /^(?:Item\s*)?(?:\d+\.?\d*|[A-Za-z]\d*)$/i.test(cell) && cell.length < 10) {
              itemNumber = cell;
            } else if (!description && cell.length > 5 && isNaN(Number(cell))) {
              description = cell;
            } else if (quantity === null && !isNaN(Number(cell)) && Number(cell) > 0 && Number(cell) < 1000000) {
              quantity = Number(cell);
            } else if (!unit && /^(?:Nos|Set|Lot|Mtr|Kg|Unit|Each|Job|Month|Quarter)$/i.test(cell)) {
              unit = cell;
            } else if (rate === null && !isNaN(Number(cell)) && Number(cell) > 0) {
              rate = Number(cell);
            } else if (amount === null && !isNaN(Number(cell)) && Number(cell) > 0) {
              amount = Number(cell);
            }
          }

          if (description || itemNumber) {
            boqRows.push({
              sheet: sheetName,
              rowIndex: rowIdx + 1,
              itemNumber: itemNumber || `Item ${rowIdx + 1}`,
              description: description || rowStr.substring(0, 100),
              quantity,
              unit: unit || 'Nos',
              rate,
              amount,
              rawText: rowStr
            });
          }
        }
      });

      pages.push({
        pageNumber: index + 1,
        text: formattedTable,
        isUncertain: false
      });
      textSegments.push(formattedTable);
    });

    return {
      text: textSegments.join('\n\n'),
      pages: pages.length ? pages : [{ pageNumber: 1, text: 'Spreadsheet empty', isUncertain: false }],
      boqRows,
      isPageCountExact: true
    };
  } catch (err) {
    console.warn('Spreadsheet parse error', err);
    return {
      text: '',
      pages: [],
      boqRows: [],
      isPageCountExact: false
    };
  }
}

/**
 * Extract realistic section headers and structure from document text
 */
function extractSectionsFromText(text: string, pages: DocumentPage[]): DocumentSection[] {
  const sections: DocumentSection[] = [];
  
  // High-coverage procurement section pattern:
  // Examples: "Section 2.1", "Clause 4.2", "SECTION IV", "ANNEXURE-I", "SCHEDULE-A", "Query #14", "Item 1.01"
  const sectionRegex = /(?:SECTION\s+[0-9IVXLCDM.]+|Section\s+[0-9A-Za-z.]+|Clause\s+[0-9A-Za-z.]+|Cl\.\s*[0-9A-Za-z.]+|ANNEXURE[\s-]*[0-9IVXLCDM]+|SCHEDULE[\s-]*[A-Z0-9]+|ELIGIBILITY\s+CRITERIA|TECHNICAL\s+SPECIFICATIONS?|SPECIAL\s+CONDITIONS|GENERAL\s+CONDITIONS|BID\s+DATA\s+SHEET|CRITICAL\s+DATES\s+SCHEDULE|Query\s*#?\s*\d+)(?::|\s*-|\s+)([\w\s,()-]{3,80})/gi;
  
  pages.forEach(page => {
    let match: RegExpExecArray | null;
    while ((match = sectionRegex.exec(page.text)) !== null) {
      const rawHeader = match[0].split(':')[0].split('-')[0].trim();
      const title = match[1]?.trim().substring(0, 80) || 'Procurement Clause';
      const startIndex = match.index;
      const snippet = page.text.substring(startIndex, startIndex + 300).trim();

      sections.push({
        id: `sec-${page.pageNumber}-${sections.length + 1}`,
        sectionNumber: rawHeader,
        title: `${rawHeader}: ${title}`,
        pageNumber: page.isUncertain ? null : page.pageNumber,
        content: snippet
      });
    }
  });

  return sections;
}

/**
 * Master parser: Ingests File and converts to structured representation with honest provenance
 */
export async function parseUploadedFile(file: File): Promise<ExtractedFileResult> {
  const filename = file.name;
  const fileSizeBytes = file.size;
  const lowerName = filename.toLowerCase();

  let rawText = '';
  let pages: DocumentPage[] = [];
  let boqRows: StructuredBOQRow[] | undefined = undefined;
  let isPageCountExact = true;

  if (!/\.(txt|md|csv|xlsx|xls|pdf)$/i.test(filename)) {
    throw new Error('Unsupported document format. Export Word documents as plain text before uploading.');
  }
  const arrayBuffer = await file.arrayBuffer();
  const sha256Hash = await calculateSHA256(arrayBuffer);

  if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls') || lowerName.endsWith('.csv')) {
    const result = extractFromSpreadsheet(arrayBuffer, filename);
    rawText = result.text;
    pages = result.pages;
    boqRows = result.boqRows;
    isPageCountExact = result.isPageCountExact;
  } else if (lowerName.endsWith('.pdf')) {
    const result = extractTextFromPdfBuffer(arrayBuffer);
    rawText = result.text;
    pages = result.pages;
    isPageCountExact = result.isPageCountExact;
  } else {
    // Text / markdown / doc / other
    rawText = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer);
    // Demarcate sections or page markers if present
    const explicitSplits = rawText.split(/\f|\n(?=Page\s+\d+\s+of|\bPage\s*:\s*\d+)/i);
    if (explicitSplits.length > 1) {
      pages = explicitSplits.map((pText, idx) => ({
        pageNumber: idx + 1,
        text: pText.trim(),
        isUncertain: false
      }));
      isPageCountExact = true;
    } else {
      pages = [{
        pageNumber: 1,
        text: rawText,
        isUncertain: true
      }];
      isPageCountExact = false;
    }
  }

  if (!rawText.trim()) {
    throw new Error('No usable document text extracted. Compressed/scanned PDFs need a verified text export; no placeholder evidence was created.');
  }

  const { type: docType, confidence: classificationConfidence } = detectDocumentType(filename, rawText.substring(0, 3000));
  const sections = extractSectionsFromText(rawText, pages);

  // Attach section titles to page objects
  sections.forEach(sec => {
    if (sec.pageNumber !== null) {
      const pageObj = pages.find(p => p.pageNumber === sec.pageNumber);
      if (pageObj) {
        if (!pageObj.sectionTitles) pageObj.sectionTitles = [];
        if (!pageObj.sectionTitles.includes(sec.title)) {
          pageObj.sectionTitles.push(sec.title);
        }
      }
    }
  });

  const pageCount = pages.length;
  const summary = `Ingested ${filename} (${docType.replace(/_/g, ' ')}, ${isPageCountExact ? `${pageCount} pages` : 'Page locations unverified'}, ${(fileSizeBytes / 1024).toFixed(1)} KB, SHA-256: ${sha256Hash.substring(0, 12)}...). Extracted ${sections.length} sections and ${rawText.length} characters.`;

  return {
    filename,
    fileSizeBytes,
    fileType: docType,
    classificationConfidence,
    pageCount,
    isPageCountExact,
    extractedText: rawText,
    pages,
    sections,
    boqRows,
    sha256Hash,
    summary
  };
}
