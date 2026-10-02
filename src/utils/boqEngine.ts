import { BOQItemChange, GroundedCitation } from '../types';
import { StructuredBOQRow } from './fileExtractor';

/**
 * Compare original vs revised BOQ sheets or lines
 * Computes deterministic quantity deltas, percentage changes, and spec modifications.
 */
export function compareBOQDatasets(
  originalRows: StructuredBOQRow[],
  revisedRows: StructuredBOQRow[],
  originalDocName: string,
  revisedDocName: string
): BOQItemChange[] {
  const changes: BOQItemChange[] = [];

  if (!originalRows || originalRows.length === 0) {
    // If only revised rows exist, all items are new items
    revisedRows.forEach((rev, idx) => {
      changes.push({
        id: `boq-item-${Date.now()}-${idx}`,
        itemNumber: rev.itemNumber || `Item ${idx + 1}`,
        description: rev.description,
        originalQuantity: 0,
        revisedQuantity: rev.quantity || 1,
        unit: rev.unit || 'Nos',
        originalSpec: 'Not present in baseline tender',
        revisedSpec: rev.description,
        percentageChange: 100,
        changeType: 'NEW_ITEM',
        pricingImpactNotes: `New line item introduced in ${revisedDocName}. Requires pricing in revised financial schedule.`,
        sourceCitation: {
          documentName: revisedDocName,
          pageNumber: 1,
          sectionNumber: rev.sheet,
          clauseTitle: rev.itemNumber,
          exactSnippet: rev.rawText || rev.description,
          isVerifiedAgainstSource: true
        },
        provenance: 'DETERMINISTIC'
      });
    });
    return changes;
  }

  // Map original rows by item number and normalized description
  const origMap = new Map<string, StructuredBOQRow>();
  originalRows.forEach(row => {
    const key = (row.itemNumber || row.description).toLowerCase().trim();
    origMap.set(key, row);
  });

  const matchedOrigKeys = new Set<string>();

  revisedRows.forEach((revRow, idx) => {
    const key = (revRow.itemNumber || revRow.description).toLowerCase().trim();
    let orig = origMap.get(key);

    // If not found by exact key, try fuzzy matching by description tokens
    if (!orig) {
      const revTokens = new Set(revRow.description.toLowerCase().split(/\s+/).filter(w => w.length > 3));
      for (const [k, candidate] of origMap.entries()) {
        if (!matchedOrigKeys.has(k)) {
          const candTokens = candidate.description.toLowerCase().split(/\s+/).filter(w => w.length > 3);
          const overlap = candTokens.filter(t => revTokens.has(t)).length;
          if (overlap >= 2 && overlap / Math.max(candTokens.length, 1) > 0.5) {
            orig = candidate;
            break;
          }
        }
      }
    }

    if (orig) {
      matchedOrigKeys.add((orig.itemNumber || orig.description).toLowerCase().trim());
      const origQty = orig.quantity !== null ? orig.quantity : 1;
      const revQty = revRow.quantity !== null ? revRow.quantity : 1;
      const qtyDiff = revQty - origQty;
      const pctChange = origQty > 0 ? Math.round(((revQty - origQty) / origQty) * 100) : 0;

      const specChanged = orig.description.trim().toLowerCase() !== revRow.description.trim().toLowerCase();

      if (qtyDiff !== 0 || specChanged) {
        let changeType: BOQItemChange['changeType'] = 'UNCHANGED';
        let impact = '';

        if (qtyDiff > 0) {
          changeType = 'QTY_INCREASED';
          impact = `Quantity increased by +${qtyDiff} ${revRow.unit || 'units'} (+${pctChange}%). Estimated Bill of Materials (BOM) cost will increase proportionally.`;
        } else if (qtyDiff < 0) {
          changeType = 'QTY_DECREASED';
          impact = `Quantity reduced by ${Math.abs(qtyDiff)} ${revRow.unit || 'units'} (${pctChange}%). Total line value will decrease.`;
        } else if (specChanged) {
          changeType = 'SPEC_MODIFIED';
          impact = `Technical specifications or scope modified in revised schedule. Verify unit rate against revised BOM parameters.`;
        }

        changes.push({
          id: `boq-item-${Date.now()}-${idx}`,
          itemNumber: revRow.itemNumber || orig.itemNumber || `Item ${idx + 1}`,
          description: revRow.description || orig.description,
          originalQuantity: origQty,
          revisedQuantity: revQty,
          unit: revRow.unit || orig.unit || 'Nos',
          originalSpec: orig.description,
          revisedSpec: revRow.description,
          percentageChange: pctChange,
          changeType,
          pricingImpactNotes: impact,
          sourceCitation: {
            documentName: revisedDocName,
            pageNumber: 1,
            sectionNumber: revRow.sheet,
            clauseTitle: revRow.itemNumber,
            exactSnippet: revRow.rawText || revRow.description,
            isVerifiedAgainstSource: true
          },
          provenance: 'DETERMINISTIC'
        });
      }
    } else {
      // New item introduced in revised BOQ
      changes.push({
        id: `boq-item-${Date.now()}-${idx}`,
        itemNumber: revRow.itemNumber || `Item ${idx + 1}`,
        description: revRow.description,
        originalQuantity: 0,
        revisedQuantity: revRow.quantity || 1,
        unit: revRow.unit || 'Nos',
        originalSpec: 'Not present in baseline tender',
        revisedSpec: revRow.description,
        percentageChange: 100,
        changeType: 'NEW_ITEM',
        pricingImpactNotes: `New item added in ${revisedDocName}. Must be priced in the submitted financial quote.`,
        sourceCitation: {
          documentName: revisedDocName,
          pageNumber: 1,
          sectionNumber: revRow.sheet,
          clauseTitle: revRow.itemNumber,
          exactSnippet: revRow.rawText || revRow.description,
          isVerifiedAgainstSource: true
        },
        provenance: 'DETERMINISTIC'
      });
    }
  });

  // Check for removed items
  origMap.forEach((origRow, key) => {
    if (!matchedOrigKeys.has(key)) {
      changes.push({
        id: `boq-item-${Date.now()}-rem-${origRow.itemNumber}`,
        itemNumber: origRow.itemNumber,
        description: origRow.description,
        originalQuantity: origRow.quantity || 1,
        revisedQuantity: 0,
        unit: origRow.unit || 'Nos',
        originalSpec: origRow.description,
        revisedSpec: 'Deleted / Removed in revised BOQ',
        percentageChange: -100,
        changeType: 'REMOVED_ITEM',
        pricingImpactNotes: `Item removed in revised schedule. Omit from pricing submission.`,
        sourceCitation: {
          documentName: originalDocName,
          pageNumber: 1,
          sectionNumber: origRow.sheet,
          clauseTitle: origRow.itemNumber,
          exactSnippet: origRow.rawText || origRow.description,
          isVerifiedAgainstSource: true
        },
        provenance: 'DETERMINISTIC'
      });
    }
  });

  return changes;
}
