# TenderDelta source-to-claim 100 evaluation

**The current implementation does not demonstrate reliable source-to-claim grounding.** Its existing quote validator passes 39/100 adversarial proposed-claim cases. A new opt-in guard on the isolated evaluation branch passes 93/100, with zero unsupported accepted claims among 19 accepted claims. It remains unconnected to the app UI and answer generation. Separate actual extraction measurements expose coverage and ungrounded draft-date defects.

The benchmark is implemented and reusable. The product is not certified by it.

## Architecture and measured scope

There are three distinct measurements: (1) existing production quote-validation acceptance of submitted claims; (2) the new structured evidence guard accepting/rejecting those same claims; (3) actual unchanged local extraction outputs. Baseline and final adapters receive source documents, the question, proposed fact and proposed citations, but no gold, category, benchmark ID or rationale. Independent scoring checks fact fields, annotated supporting spans, citation identity/completeness and severity. Runtime IDs/date noise are excluded or frozen.

The baseline calls validateMaterialChange, retrieveBoundedSourceContext and runLocalGroundedAnalysis. Only existing quote validation controls acceptance; retrieval/extraction counts are diagnostic. Final uses validateProcurementClaim, an explicit field grammar with authority/tender filters, exact quotations, linked field-level amendments, conflicts, date/currency/unit checks and cited arithmetic operands. Neither adapter generates arbitrary natural-language answers. The extraction audit separately scores actual requirements/deadlines against gold after extraction.

## Frozen identities and process

- Submission candidate: `7b37a018e7fb77d0d6bffd76acb465606620e2dd`, `feat/serpapi-hackathon-2026`.
- Measured readiness snapshot: `709504c514be1628e890697c175a0397d13bccf6`; includes prior private repairs, not merely the original candidate.
- Dataset v1.0.0, frozen before measurements; SHA-256: `462b64a4f0185dc31b37fc66cffb41e0d38b4e016befef5c713622a2bd8b13c8`.
- Guard frozen before held-out result inspection: `3bd17cfd5d8cd7232688036c91de38254391d0ac`; policy SHA-256: `94230653a75146c25f9e82d63c83a10a76762d97b4c3dc07eda2457e68d57d0d`.
- Independently reviewed 100 gold definitions before freeze; pre-freeze fixes clarified eligibility ambiguity, table evidence, tax scope and item subjects.
- Same cases/labels for before and after; no case tuning or policy changes after held-out results. Scorer bugs were repaired and the unchanged baseline was rescored using the final scorer.
- Development: 75 cases; held-out: 25 cases, chosen by deterministic SHA ordering. Development results informed fixes; held-out output was not inspected before the guard freeze.

## Exact taxonomy and category failures

| Category | Cases | Baseline pass | Final pass | Baseline errors | Final errors | Baseline weighted errors | Final weighted errors |
|---|---:|---:|---:|---:|---:|---:|---:|
| A: Citation correctness | 10 | 1 | 10 | 9 | 0 | 125 | 0 |
| B: Unsupported/hallucinated claims | 10 | 0 | 8 | 10 | 2 | 190 | 10 |
| C: Conflicting sources | 10 | 3 | 9 | 7 | 1 | 130 | 5 |
| D: Corrigenda/superseded information | 10 | 3 | 9 | 7 | 1 | 140 | 5 |
| E: Dates/deadlines/temporal reasoning | 8 | 4 | 8 | 4 | 0 | 160 | 0 |
| F: Amounts/currency/arithmetic | 8 | 3 | 8 | 5 | 0 | 110 | 0 |
| G: Entity/tender identity collisions | 8 | 1 | 8 | 7 | 0 | 120 | 0 |
| H: Missing evidence/abstention | 8 | 8 | 8 | 0 | 0 | 0 | 0 |
| I: Extraction corruption/formatting | 8 | 7 | 6 | 1 | 2 | 10 | 10 |
| J: Retrieval/distractor sources | 6 | 3 | 6 | 3 | 0 | 80 | 0 |
| K: Hostile document instructions | 6 | 2 | 6 | 4 | 0 | 70 | 0 |
| L: Multi-source provenance | 6 | 4 | 5 | 2 | 1 | 20 | 5 |
| R: Research-style difficult cases | 2 | 0 | 2 | 2 | 0 | 30 | 0 |
| **Total** | **100** | **39** | **93** | **61** | **7** | **1,185** | **35** |

The corpus contains 21 positive claims, 74 unsupported/insufficient-evidence cases and 5 unresolved conflicts. CASE_CATALOG.md lists every distinct failure property and rationale. R01 models an unsigned amendment that cannot be promoted to authority; R02 models a registration-to-certification eligibility inference that the evidence cannot justify.

## Baseline and post-fix metrics

| Metric | Baseline | Frozen guard |
|---|---:|---:|
| claimAccuracy | 33/81 (40.7%) | 19/19 (100.0%) |
| evidenceSupportAccuracy | 21/81 (25.9%) | 19/19 (100.0%) |
| citationCorrectness | 44/89 (49.4%) | 23/23 (100.0%) |
| citationCompleteness | 26/26 (100.0%) | 23/26 (88.5%) |
| unsupportedClaimRate | 60/81 (74.1%) | 0/19 (0.0%) |
| wrongSourceRate | 29/81 (35.8%) | 0/19 (0.0%) |
| provenanceViolationRate | 15/81 (18.5%) | 0/19 (0.0%) |
| correctAbstentionRate | 18/74 (24.3%) | 69/74 (93.2%) |
| falseAbstentionRate | 0/21 (0.0%) | 2/21 (9.5%) |
| conflictResolutionAccuracy | 0/5 (0.0%) | 5/5 (100.0%) |
| temporalUpdateAccuracy | 7/18 (38.9%) | 17/18 (94.4%) |
| numericExtractionAccuracy | 3/8 (37.5%) | 8/8 (100.0%) |

Severity-weighted reliability: **39.69% -> 98.22%**. This is a chosen weighted diagnostic, not a probability of safe operation. Weight budget is 1,965. Raw failing cases: 61 -> 7; weighted observed errors: 1,185 -> 35; maximum observed severity: S5 -> S2.

Claim/support metrics use accepted claims as denominator, not all cases. The guard accepts 19/100; gold has 21 supported claims. Positive acceptance coverage is 19/21, accompanied by two false refusals. Citation completeness uses all 26 required positive spans and therefore penalizes refusal. Unsupported rate includes accepted assertions/proofs that gold rejects, even when a fact value happens to be true. Temporal-update and numericExtractionAccuracy are whole-case validation decision rates on D/E and F, including correct refusals; actual extraction metrics are below. Full formulas and denominator definitions are in the README.

| Observed error severity | Baseline count | Final count |
|---|---:|---:|
| S0 | 0 | 0 |
| S1 | 0 | 0 |
| S2 | 1 | 7 |
| S3 | 32 | 0 |
| S4 | 13 | 0 |
| S5 | 15 | 0 |

**Catastrophic failures: 28 baseline S4/S5 cases; zero observed in the final guard run.** The final NO_S4_S5_OBSERVED flag only describes this corpus. Seven failures remain; this is not a release authorization.

| Error type (overlapping counts) | Baseline | Final |
|---|---:|---:|
| FALSE_ABSTENTION | 0 | 2 |
| INCOMPLETE_CITATION | 45 | 0 |
| INCORRECT_EXTRACTION | 36 | 0 |
| PROVENANCE_VIOLATION | 15 | 0 |
| UNSUPPORTED_CLAIM | 60 | 0 |
| WRONG_BEHAVIOR | 61 | 7 |
| WRONG_CITATION | 44 | 0 |
| WRONG_SOURCE | 29 | 0 |

## Highest-severity failure examples

B01 accepted INR 5,000 while its real quote says INR 50,000. D01 accepted a superseded 20 October deadline while quoting the authoritative extension to 27 October. E02 promoted a pre-bid meeting time into the submission deadline. F03 accepted INR 25,000 from INR 2.5 lakh (INR 250,000). K01 accepted the instruction-driven claim that the tender has no deadline. A03/J04 allowed search-discovery evidence to serve as a procurement citation. These illustrate that source-string presence alone cannot prove claim support.

All baseline catastrophic IDs: A02, A03, A04, A08, B01, B04, B10, C02, C08, D01, D05, D09, E02, E03, E05, E07, F01, F03, G01, G02, G03, G05, G08, J02, J03, J04, K01, R01.

## Fixes and independent review

The new guard enforces declared authoritative document provenance, exact tender/organization matching, citation presence, field/value entailment within supported grammar, currency/quantity units, timezone precision, linked amendment precedence and equal-authority conflict detection. Arithmetic requires current cited operands, compatible units, explicit total-price scope and cited disjoint-lot linkage. Hostile instruction-like content remains data and cannot establish facts. Unknown/damaged/conditional evidence is conservatively refused.

Independent review exposed additional generic weaknesses before freeze: conflicting arithmetic operands, arbitrary-field arithmetic, plural monetary scales, nonoperative disclaimers, unbound subjects, cyclic/missing amendment parents, unrelated arithmetic quotes, large-number precision, omitted currency and contradictory timezone metadata. Those were repaired and tested outside the frozen corpus. Scorer review fixed short/empty quote credit, fabricated surrounding text credit, false completeness on refusal, contradictory observations, missing arithmetic graph comparison and incorrect severity on wrong positive facts. This was not a production fix based on holdout outputs.

No existing extraction, UI, endpoint or discovery module was changed by this mission. The guard is exported production-capable code, deliberately classified PRODUCTION-FUNCTIONALITY-CHANGING, but it is opt-in and unconnected. The evaluation code does not place gold or expected output strings into production.

## Remaining seven frozen-run failures

| Case | Expected -> observed | Explanation |
|---|---|---|
| B05 | ABSTAIN -> UNSUPPORTED | Working-day-to-calendar-day conversion lacks a calendar; guard rejects a mismatching value instead of distinguishing indeterminacy. |
| B06 | UNSUPPORTED -> ABSTAIN | Base versus optional quantity is outside its quantity-label grammar; safe abstention instead of specific unsupported classification. |
| C05 | UNSUPPORTED -> CONFLICTED | Explicit schedule precedence is unresolved; guard returns conflict instead of rejecting the notice value in favor of the schedule. |
| D02 | SUPPORTED -> UNSUPPORTED | Generic all-other-terms-unchanged citation is rejected; unchanged original EMD is valid. False refusal. |
| I05 | SUPPORTED -> ABSTAIN | Mojibake whitespace prevents safe money parsing. False refusal; no OCR digit repair is attempted. |
| I08 | UNSUPPORTED -> CONFLICTED | An appendix example is treated as competing field evidence; guard reports conflict instead of nonoperative-claim rejection. |
| L04 | ABSTAIN -> UNSUPPORTED | Missing arithmetic price/evidence is classified unsupported instead of abstain. |

All seven emit no claim and no citation. They are retained as S2 failures under the declared scoring policy. Refusal-label distinctions still matter, even when unsupported acceptance is avoided. Five are held-out failures. They were documented rather than tuned away.

## Separate unchanged extraction audit

Actual extractor emissions: **18 correct, 1 wrong, 4 unscorable** (23 total). Scorable value accuracy: **18/19 (94.7%)**. Grounded correct coverage over its explicit EMD/turnover/deadline surface: **18/39 (46.2%)**; field-emission coverage: **19/39 (48.7%)**. All explicitly adjudicated field coverage: **19/71 (26.8%)**, including fields outside its implementation. Source grounding: **22/23**. Nine boundary-whitespace citation artifacts are separately cosmetic.

The material wrong extraction is D08: the unchanged engine retains original INR 10 lakh turnover instead of amended INR 8 lakh. Two unscorable value emissions (C02/C06) additionally select facts despite adjudicated unresolved authoritative conflicts. They are separately flagged as unsafe conflict emissions; 18/19 value precision excludes them, and 22/23 physical source grounding does not mean safe conflict resolution. It emits no deadline in any of 18 explicit deadline gold cases and substitutes frozen ingestion time as the draft submission deadline in all 100 cases. These placeholders are not credited as extracted facts. The corpus uses explicit ISO-style deadline labels not recognized by its legacy parser; 0/18 is a result for this corpus, not proof that every real document date fails. No post-fix improvement is claimed for the unchanged extractor.

## Controls, validation and reproducibility

Always-accept: 21/100, catastrophic gate fails. Always-abstain: 56/100, misses supported facts. Oracle: 100/100, scorer self-consistency only. Guard metamorphic checks pass 100/100 with case shuffling, document reversal and irrelevant wording prefixes. Separate 277 property/regression checks pass with varied identifiers/values, one-unit errors and generic review probes. Existing suites pass: 20 evidence cases, 12 intelligence regressions, discovery fixtures and readiness regressions. TypeScript and complete app production build pass. Existing bundle-size/browser-external warnings persist. No packages downloaded or live API/model calls made.

Baseline JSON diagnostics and final observations are deterministic; schema/corpus/source hashes are verified. Baseline and final use the same corrected scorer. The portable artifact includes baseline dependency modules, new guard, machine schema, 100 case/gold pairs, runners, reports and dependency manifest. It contains no Git history, node_modules, credentials or host paths. README gives commands; process success means measurement executed, not benchmark pass.

Held-out score: **20/25 (80%)**, compared with development **73/75 (97.3%)**. Only 2/3 held-out supported claims are accepted. This unstratified holdout has no numeric F cases; it provides weak generalization evidence. Fixture labels are visible to authors/reviewers, and cases share vocabulary/templates. An independent real-document holdout is required before product confidence.

## Integration classification and submission protection

| Change | Classification | Integration judgment |
|---|---|---|
| Corpus, gold, schema, standalone property cases | TEST-ONLY | Candidate for independent test-only review |
| Runners, scoring, source locks, reports, npm script additions | BENCHMARK-INFRA-ONLY | Review package/script merge; offline execution only |
| README, catalog, evaluation report, working state | DOCUMENTATION-ONLY | Ensure claims remain qualified |
| src/utils/sourceClaimPolicy.ts | PRODUCTION-FUNCTIONALITY-CHANGING | Separate integration/revalidation required; do not merge automatically |

The corpus/schema/catalog are behavior-neutral candidates. Runners are pinned to the readiness snapshot; final and property scripts depend on the new guard. They cannot be merged unchanged as a standalone test-only update to an older candidate without adapting wiring and revalidation. The patch targets the pinned private readiness snapshot, not bare 7b37a018.

The hackathon branch and prior readiness checkout were not modified by this mission. No push, merge, force-push, history rewrite, public repository change, hackathon submission, SerpApi contact or external commitment occurred. The isolated eval branch contains local commits only. Original submission HEAD remains 7b37a018; existing SerpApi implementation is unchanged.

The historical SerpApi validation at b15bc57b9de1376a6175ade98183ba99bf72e4f3 remains applicable to its previously validated discovery behavior and unchanged submission source. It does not validate the new guard, current live API behavior or source-to-claim reliability. No new live SerpApi benchmark was run.

## Limits and next research mission

Synthetic text does not measure actual PDF parsing/OCR, authenticated issuing authority, signatures, redirects/domains, live ranking, long retrieval budgets, model answer generation or UI claim display. Authority is a fixture assumption. Hostile document cases test contaminated evidence acceptance; secret disclosure and tool-action security are not exercised. Questions are not semantically mapped to fields by the guard. Semantics are independent annotated spans and structured facts, not a general entailment judge. Conflict explanation citations are not completeness-scored. Narrow grammar and whole-document conditional/damage refusal can reject valid evidence. Frozen I05 contains a pre-freeze U+00C2-plus-NBSP encoding artifact despite its property describing NBSP alone; this run preserves the case unchanged and reports it as mojibake. A clean-NBSP paired fixture should be versioned separately. Severity/reliability weights are policy choices. The two difficult provenance cases are simulations, not research novelty claims.

**Can TenderDelta currently demonstrate grounded procurement claims with correct authoritative evidence, citations and safe abstention? No, for the existing app.** The baseline admits 60 invalid assertions/proofs among 81 accepted candidates, with 15 provenance violations. The new isolated guard demonstrates a much safer bounded validation contract for these 100 cases, but seven decisions still fail, accepted-positive coverage is 19/21 and actual unchanged extraction has material weaknesses. Integration and end-to-end evidence remain outstanding.

Recommended next mission: replace free-text claim acceptance with an explicit proof object carried from authenticated source through field extraction, amendment graph, generated answer and displayed citation. Remove ingestion-time procurement deadlines. Evaluate a fresh independent set of de-identified real source PDFs and signed corrigenda, with missing-document and model/tool canary tests. Use separate implementation and independent oracle-review agents, and hold fixed measurable release gates before exposing the holdout.
