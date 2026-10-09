import assert from 'node:assert/strict';
import { retrieveBoundedSourceContext, validateGroundedCitation } from './evidenceValidator';
import type { TenderDocument } from '../types';

const document = (id: string, text: string): TenderDocument => ({
  id, tenderId: 'fixture', name: `${id}.txt`, type: 'ORIGINAL_NIT',
  versionLabel: 'v1.0', pageCount: 0, fileSizeBytes: text.length,
  provenance: 'USER_UPLOADED', extractedText: text,
});

const first = document('first', 'First tender source. '.repeat(80));
const hidden = document('hidden', 'Mandatory performance security is 10 percent. '.repeat(80));
const partial = retrieveBoundedSourceContext([first, hidden], { characterBudget: 400 });
assert.equal(partial.coverage.totalDocumentCharacters, first.extractedText!.length + hidden.extractedText!.length);
assert.equal(partial.coverage.totalSections, 2);
assert.equal(partial.coverage.isFullyCovered, false);
assert.ok(partial.coverage.coveragePercent < 10, 'Unretrieved later documents must remain in the coverage denominator.');
assert.ok(partial.coverage.retrievedCharacters < 400, 'Wrappers and limit markers must not count as source evidence.');

const complete = retrieveBoundedSourceContext([first, hidden], { characterBudget: 10000 });
assert.equal(complete.coverage.coveragePercent, 100);
assert.equal(complete.coverage.isFullyCovered, true);
assert.equal(complete.coverage.retrievedCharacters, complete.coverage.totalDocumentCharacters);

const sparse = document('sparse', 'Header only.\nMissing security clause.\n');
sparse.sections = [{ id: 's1', sectionNumber: '1', title: 'Header', pageNumber: null, content: 'Header only.' }];
const excerpts = retrieveBoundedSourceContext([sparse], { characterBudget: 10000 });
assert.equal(excerpts.coverage.isFullyCovered, false, 'Having all section excerpts does not prove full-document coverage.');

const repeated = document('repeated', 'Duplicate excerpt. A clause that was not retrieved.');
repeated.sections = [1, 2, 3, 4].map(i => ({ id: `s${i}`, sectionNumber: String(i), title: 'Duplicate', pageNumber: null, content: 'Duplicate excerpt.' }));
const overlapping = retrieveBoundedSourceContext([repeated], { characterBudget: 10000 });
assert.equal(overlapping.coverage.retrievedCharacters, 'Duplicate excerpt.'.length);
assert.equal(overlapping.coverage.isFullyCovered, false, 'Repeated excerpts must not inflate coverage.');
assert.equal(retrieveBoundedSourceContext([]).coverage.isFullyCovered, false, 'An empty corpus supplies no evidence.');

const threshold = document('threshold', 'The permitted amount must be < 10.');
assert.equal(validateGroundedCitation({ documentId: threshold.id, documentName: threshold.name, exactSnippet: 'amount must be > 10' }, [threshold]).verificationStatus, 'FAILED_VALIDATION');
assert.equal(validateGroundedCitation({ documentId: threshold.id, documentName: threshold.name, exactSnippet: '!!!' }, [threshold]).verificationStatus, 'FAILED_VALIDATION');
assert.equal(validateGroundedCitation({ documentId: threshold.id, documentName: threshold.name, exactSnippet: 'amount must be < 10' }, [threshold]).verificationStatus, 'VERIFIED');
console.log('Evidence readiness regressions passed.');
