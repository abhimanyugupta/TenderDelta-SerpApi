import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MethodologyView } from './MethodologyView';
import { INDIAN_PROCUREMENT_RULES } from '../data/taxonomy';

const markup = renderToStaticMarkup(<MethodologyView />);

assert.match(markup, /Coverage varies by field and document/);
assert.match(markup, /Selected Provenance Checks &amp; Adversarial Evidence Benchmark/);
assert.match(markup, /fixture observations, not product-wide reliability estimates/);
assert.match(markup, /20-case deterministic fixture set • Run to view current results/);
assert.doesNotMatch(markup, /Fail-Closed Provenance Pipeline|absolute architectural separation|Every assertion must resolve|Compliance Guard|PROVENANCE &amp; AUDIT ENGINE|Primary trust metric/);

for (const rule of INDIAN_PROCUREMENT_RULES) {
  assert.match(rule.summary, /current|verify|confirm/i, `${rule.code} summary must direct users to current source review`);
  assert.match(rule.impactOnTenders, /current|verify|check|review/i, `${rule.code} impact note must direct users to source review`);
  assert.doesNotMatch(`${rule.summary} ${rule.impactOnTenders}`, /\b\d+(?:\.\d+)?\s*(?:%|days?|crore|lakh|lakhs)\b/i,
    `${rule.code} must not present an uncited fixed threshold or time period`);
}

console.log('Methodology copy checks passed: bounded evidence claims, review caveats, and no uncited fixed legal thresholds.');
