import assert from 'node:assert/strict';
import { executeTenderAnalysis, type IngestionPipelineInput } from './analysisEngine';
import { parseUploadedFile } from './fileExtractor';
import { parseSerpApiDiscoveryResponse } from './serpApiDiscovery';

const input: IngestionPipelineInput = {
  title: 'Synthetic readiness fixture', referenceNumber: 'TEST', organization: 'Synthetic',
  portal: 'CUSTOM', estimatedValueInr: 0,
  originalDocs: [{ id: 'baseline', filename: 'baseline.txt', type: 'ORIGINAL_NIT', pageCount: 1,
    fileSizeBytes: 50, extractedText: 'Annual financial turnover INR 10 crore. Amount must be < 10.' }],
  corrigendaDocs: [],
};
const originalFetch = globalThis.fetch;
let sent: any;
const runWith = async (change: any) => {
  globalThis.fetch = async (_url, options) => {
    sent = JSON.parse(String(options?.body));
    return new Response(JSON.stringify({ changes: [change] }), { status: 200 });
  };
  return executeTenderAnalysis(input);
};
const candidate = {
  title: 'Candidate interpretation', requirementKey: 'AI_ONLY', category: 'TECHNICAL',
  changeType: 'MODIFIED', materiality: 'HIGH', confidence: 'HIGH',
  sourceCitation: { documentId: 'baseline', documentName: 'baseline.txt', exactSnippet: 'Amount must be < 10.' },
};
try {
  const rejected = await runWith({ ...candidate, isQuarantined: true, verificationStatus: 'REJECTED' });
  assert.equal(rejected.changes.length, 0, 'Server rejection must remain rejected.');
  assert.equal(sent.documents[0].id, 'baseline', 'Request must preserve immutable document identity.');
  assert.ok(sent.documents[0].extractedText, 'Request must preserve source text.');
  assert.equal((await runWith({ ...candidate, sourceCitation: { exactSnippet: '' } })).changes.length, 0);
  assert.equal((await runWith({ ...candidate, sourceCitation: { ...candidate.sourceCitation, documentId: 'other' } })).changes.length, 0);
  assert.equal((await runWith({ ...candidate, sourceCitation: { ...candidate.sourceCitation, exactSnippet: 'Amount must be > 10.' } })).changes.length, 0);
  const valid = await runWith(candidate);
  assert.equal(valid.changes.length, 1);
  assert.equal(valid.changes[0].sourceCitation.sourceDocumentId, 'baseline');
  assert.equal(valid.changes[0].verificationStatus, 'UNREVIEWED', 'Quote identity is not claim entailment.');
  assert.equal(valid.changes[0].factVsInterpretation, 'AI_INTERPRETATION');
} finally { globalThis.fetch = originalFetch; }

const credentialedUrl = new URL('https://source.example/');
credentialedUrl.username = 'test-user';
credentialedUrl.password = 'test-secret';
const parsed = parseSerpApiDiscoveryResponse({ organic_results: [
  { link: 'https://source.example/tender' }, { link: 'https://source.example/tender' },
  { link: 'https://' }, { link: credentialedUrl.href }, { link: 'javascript:alert(1)' },
] });
assert.equal(parsed.results.length, 1);
assert.equal(parsed.results[0].authoritative, false);
await assert.rejects(parseUploadedFile(new File([''], 'empty.pdf')), /No usable document text/);
await assert.rejects(parseUploadedFile(new File(['%PDF-1.4\n/Type /Catalog\n'], 'metadata.pdf')), /No usable document text/);
await assert.rejects(parseUploadedFile(new File(['PK binary'], 'unsupported.docx')), /Unsupported document format/);
const text = await parseUploadedFile(new File(['Annual financial turnover INR 10 crore.'], 'baseline.txt'));
assert.equal(text.extractedText, 'Annual financial turnover INR 10 crore.');
assert.equal(text.sha256Hash.length, 64);
console.log('Readiness pipeline regressions passed: quarantine, identity, operators, parsing and discovery.');
