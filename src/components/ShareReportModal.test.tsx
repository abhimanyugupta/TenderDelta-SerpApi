import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DEMO_TENDER } from '../data/demoTender';
import { ShareReportModal } from './ShareReportModal';

const markup = renderToStaticMarkup(
  <ShareReportModal isOpen onClose={() => undefined} tender={DEMO_TENDER} />
);

const shareUrl = markup.match(/value="(https:\/\/example\.invalid\/briefs\/share\/[^"]+)"/);
assert.ok(shareUrl, 'the sample URL should use the reserved .invalid domain');
assert.equal(new URL(shareUrl[1]).search, '', 'the sample URL should not imply a credential or access token');
assert.match(markup, /Example advisory firm/);
assert.match(markup, /Example client organization/);
assert.match(markup, /Advisor name/);
assert.match(markup, /Direct cloud sharing server is not connected/);
assert.equal((markup.match(/value=""/g) ?? []).length, 3, 'branding fields should start empty');

console.log('Share modal checks passed: no plausible fabricated identities or live-looking share credentials.');
