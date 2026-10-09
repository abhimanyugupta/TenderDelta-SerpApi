import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ConflictDetectorView } from './ConflictDetectorView';
import { DEMO_TENDER } from '../data/demoTender';

const render = (tender: typeof DEMO_TENDER) => renderToStaticMarkup(
  <ConflictDetectorView tender={tender} onOpenSourceViewer={() => undefined} />
);

const markup = render(DEMO_TENDER);
assert.match(markup, /Discrepancy in EMD Deposit Amount/);
assert.match(markup, /Category: EMD/);
assert.match(markup, /NIT_089_T04_Original_Tender\.pdf/);
assert.match(markup, /Page 64, Annexure VII Form C/);
assert.match(markup, /Resolved by Corrigendum/);
assert.match(markup, /Active unresolved ambiguity/);
assert.match(markup, /Suggested clarification:/);

const withoutPage = {
  ...DEMO_TENDER,
  conflicts: [{
    ...DEMO_TENDER.conflicts[0],
    statementA: { ...DEMO_TENDER.conflicts[0].statementA, pageNumber: null },
    statementB: { ...DEMO_TENDER.conflicts[0].statementB, pageNumber: null },
  }],
};
const withoutPageMarkup = render(withoutPage);
assert.match(withoutPageMarkup, /Page unavailable/);
assert.doesNotMatch(withoutPageMarkup, />View Clause [AB]</);

console.log('Conflict view render checks passed: current schema, source details, status labels, and safe missing-page behavior.');
