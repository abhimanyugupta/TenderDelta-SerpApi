# Source-to-claim 100, dataset v1.0.0

This is a deterministic adversarial evaluation of proposed procurement claims. It compares TenderDelta's existing quote validator with an isolated, opt-in structured evidence guard. A separate audit measures actual outputs of the unchanged local extractor. The guard is **not connected to the current UI or answer-generation endpoints**.

The benchmark has exactly 100 cases, not 100 randomly generated documents. Every case supplies authoritative text fixtures, distractors, a proposed claim/citation set, an independently justified gold fact/proof and a decision label. `cases/cases.json` is the canonical aggregate; the 100 individual case files and `expected/` copies must agree with it.

## Files

```text
tests/source_claim_100/
  cases/                 100 individual cases plus canonical aggregate
  expected/              100 gold proof/behavior/rationale files
  schema/case.schema.json
  manifest.json          version, immutable hashes, taxonomy and split
  baseline-source-lock.json
  runner/
    baseline.ts          actual existing validator adapter
    run.ts               evaluation, negative controls and metamorphic checks
    score.ts             fact/proof/severity metrics
    validate.ts          corpus invariants
    types.ts             adapter contract that excludes gold
    regression.ts        standalone property/scorer checks
    extraction-audit.ts  actual unchanged extractor output audit
  reports/               baseline/final/extraction JSON, controls and failures
  README.md
  CASE_CATALOG.md
src/utils/sourceClaimPolicy.ts
```

The standalone archive also carries unchanged baseline source dependencies, an evaluation-only package/TypeScript configuration, runtime versions and an artifact hash inventory. The review package includes comparison prose, machine reports, source archive/hash and a patch against the pinned readiness snapshot.

## Architecture

```text
Frozen source fixtures + question + proposed structured claim/citations
    -> baseline existing validateMaterialChange / strict quote checks
    -> OR new validateProcurementClaim structured guard
    -> observation (decision, optional accepted claim, citations)
    -> independent gold scorer -> JSON metrics, errors and severity

Frozen source fixtures -> unchanged runLocalGroundedAnalysis
    -> actual requirements/deadlines -> separate gold extraction audit
```

Adapters receive no benchmark case ID, category, expected label, rationale or gold value. Document/tender identifiers remain necessary provenance inputs. Gold is available only to scoring and the explicitly marked oracle control. The baseline also calls bounded retrieval and local extraction for diagnostics; those diagnostics do not decide proposed-claim acceptance.

`SUPPORTED` means the submitted proposition and its proof are valid. `UNSUPPORTED` rejects a contradicted value or invalid proof. `CONFLICTED` reports unresolved authoritative disagreement. `ABSTAIN` reports insufficient/ambiguous evidence. This is validation, not generation of a corrected answer. Where evidence establishes a different true value, `expected_claim` can contain that value even though the proposed assertion must be rejected. Abstention is credited only where the frozen case permits it.

## Exact taxonomy

| Category | Cases | Coverage |
|---|---:|---|
| A | 10 | Citation correctness: wrong passage/document, version, uncited fact, discovery citation |
| B | 10 | Unsupported inference: eligibility, taxes, optional quantities, calendar conversion |
| C | 10 | Equal-authority conflict, internal contradiction, contract precedence, non-amending memo |
| D | 10 | Corrigenda, chains, field-selective amendments, withdrawal, draft, wrong tender |
| E | 8 | Date conventions, pre-bid versus deadline, timezone conversion, missing anchors |
| F | 8 | Amounts, Indian grouping/scales, currency conversion, totals and unit confusion |
| G | 8 | Organization, tender ID, title, lot and entity collisions |
| H | 8 | Missing schedules/pages, unspecified values, genuine zero versus missing zero |
| I | 8 | OCR corruption, negation loss, broken/valid tables, whitespace, nonoperative examples |
| J | 6 | Distractor ranking, stale mirrors, search snippets, irrelevant official sources |
| K | 6 | Instruction-like data, fake system instructions, no-citation and public-action demands |
| L | 6 | Arithmetic joins, amendment inheritance, additive lots, missing price/unit/proof |
| R | 2 | Unsigned amendment provenance ambiguity and false eligibility join |
| **Total** | **100** | |

See `CASE_CATALOG.md` for each distinct adversarial property and gold rationale. Taxonomy intentionally follows the requested distribution, including two research-style cases. These are synthetic approximations of difficult provenance problems, not a claim of research novelty or independent source authentication.

## Freeze and reproducibility

Canonical candidate: `7b37a018e7fb77d0d6bffd76acb465606620e2dd`, `feat/serpapi-hackathon-2026`. The measured baseline includes the earlier private readiness repairs, committed only in the isolated evaluation checkout as `709504c514be1628e890697c175a0397d13bccf6`. The dataset was committed before measurement (`539ae9a`); the guard was frozen before held-out result inspection at `3bd17cfd5d8cd7232688036c91de38254391d0ac`.

Dataset SHA-256: `462b64a4f0185dc31b37fc66cffb41e0d38b4e016befef5c713622a2bd8b13c8`. Dataset and schema hashes, duplicate case/gold equality, runtime invariants and production dependency hashes are checked on every evaluation. Baseline source hashes normalize CRLF to LF so Git newline conversion does not change the semantic snapshot. Do not edit a case after seeing results. Change the dataset version/digest and keep old reports if a correction is necessary.

The 75 development / 25 held-out split was selected by deterministic SHA ordering before measurement. Only development results were used during guard debugging. No guard changes were made after the first completed 100-case evaluation. Authors/reviewers could see fixture labels; this is an operational holdout, not a cryptographically sealed or independently sampled study. The split is not stratified: category F has no held-out cases and only three held-out positive cases exist. Do not infer broad generalization from 20/25.

Use Node.js 24.16.0 with TypeScript 5.8.3, tsx 4.23.15 and the package versions in the portable artifact. Existing dependencies were reused for this run; no packages were installed. From the TenderDelta evaluation checkout, or the standalone extracted artifact with compatible dependencies available:

```sh
npm run test:source-claim
npm run eval:source-claim:baseline
npm run eval:source-claim:development
npm run eval:source-claim:final
npm run eval:source-claim:extraction
```

The portable artifact includes the exact baseline source dependencies and an evaluation-only package manifest. It contains no node_modules or credentials. Arrange the declared dependencies under your package-download policy before running it; execution does not download them or call network/model APIs. Running an npm script returns zero when the measurement succeeds even if the system fails cases. Read `summary.passed`, error/severity counts and the catastrophic gate; a successful process is not a passing benchmark.

The complete TenderDelta checkout also supports `npm run test:all`, `npm run lint`, `npm run build`. The evaluation-only artifact supports `npm run lint`; it does not contain the frontend/server build. Human-readable reports describe this frozen run; rerunning updates machine reports, so update the prose when evaluating another version.

## Metrics and oracle

The scorer checks structured value/entity/unit/currency/time fields against gold and, when present, arithmetic proof operands/operator. Operand order is immaterial. Citation correctness requires an exact nonempty source substring in the expected document containing a full adjudicated supporting span. Larger exact source quotes may pass; shorter fragments do not. This combines independently annotated semantic support with physical quotation/identity checks. It is not a generic natural-language entailment judge. Equivalent unannotated paraphrases or different valid evidence spans can be rejected.

All rates disclose numerator and denominator; empty denominators return null.

| Metric | Denominator / meaning |
|---|---|
| Claim accuracy | Accepted claims; matching independently adjudicated fact fields |
| Evidence-support accuracy | Accepted claims; gold SUPPORTED plus true fact and correct complete proof |
| Citation correctness | Emitted citations attached to accepted claims; exact gold supporting spans |
| Citation completeness | Required spans across all gold SUPPORTED cases, including missed positives |
| Unsupported-claim rate | Accepted claims; rejected-by-gold assertions/proofs or incorrect fact fields |
| Wrong-source rate | Accepted claims; any cited document outside gold supporting documents |
| Provenance-violation rate | Accepted claims; missing, discovery/webpage, nonauthoritative or wrong-tender source |
| Correct-abstention rate | Gold UNSUPPORTED/ABSTAIN cases; permitted correct rejection/abstention, excluding conflicts |
| False-abstention rate | Gold SUPPORTED cases; any refusal/conflict instead of acceptance |
| Conflict-resolution accuracy | Gold CONFLICTED cases; explicit CONFLICTED decision |
| Temporal-update accuracy | D/E cases; whole validation decision/proof pass, including safe rejection |
| Numeric extraction accuracy | F cases; whole numeric validation decision/proof pass, not extractor coverage |

The last two names satisfy the requested metric list but are **validation decision metrics**. Actual extraction value accuracy and coverage live in `extraction-audit.json`. It scores real EMD/turnover/deadline outputs without feeding proposed/gold values to extraction; unscorable emissions are disclosed and excluded from value precision. Missing extraction is a coverage miss. Placeholder draft dates are counted separately, never credited as extracted facts.

Raw error counts overlap: one claim can have wrong value, source, citation and provenance. Severity counts and weighted errors count each failing case once. S0 cosmetic, S1 minor, S2 misleading/missed or misclassified decision, S3 unsupported assertion, S4 source/provenance violation, S5 consequential fabricated/incorrect fact. Weights are 1,2,5,10,20,40. The current scoring policy escalates accepted invalid consequential S5 cases, including wrong values on positive cases. Correct refusals have zero error cost; remaining refusal classification/false-abstention failures conservatively receive S2.

Reliability = max(0, 1 - sum(observed failure weights) / sum(frozen case threat weights)). The denominator is 1,965 for this corpus. It is an explicitly chosen diagnostic, not a calibrated probability. It can look high on refusal-heavy cases; always examine coverage and positive-case false abstention beside it. Any observed S4/S5 is separately listed and blocks the catastrophic gate. `NO_S4_S5_OBSERVED` does not authorize release or mean all cases passed.

## Controls and integrity

Always-accept passes 21/100 and triggers S5; always-abstain passes 56/100 and misses valid claims; oracle passes 100/100 as a scorer consistency check only. The final guard is invariant under deterministic case shuffling, document reversal and irrelevant wording prefixing for all 100 cases. Separate regression/property checks vary arbitrary identifiers and numeric facts, ensure one-unit errors and snippet/provenance promotions fail, and exercise arithmetic conflicts, scope, scale, precision, timezone and scorer contradictions. Those 277 checks are not additional benchmark cases.

The JSON Schema documents the machine-readable contract; a dependency-free runtime validator enforces corpus invariants. The runner does not claim exhaustive Draft 2020-12 schema validation by an external schema engine. A scorer defect involving reciprocal substring matching was corrected before final scoring; baseline observations were rerun against unchanged production code with the same corrected scorer and dataset.

Two extraction emissions (C02/C06) select a value despite adjudicated authoritative conflicts. They lack a unique gold value, so they are unscorable for value precision, but are separately counted as unsafe conflict emissions. The 18/19 value precision excludes these and source-span grounding is not safe conflict resolution. Frozen I05 contains a pre-freeze mojibake artifact (U+00C2 followed by NBSP), although its property describes NBSP alone. Preserve v1.0; a new paired clean-NBSP fixture belongs in a separately versioned corpus.

## Submission boundary and limitations

All work is on `eval/source-to-claim-100` in a separate checkout. No automatic merge, push, history rewrite, external contact, publication or submission occurred. Existing readiness source modules, server, UI, SerpApi implementation and submission branch were unchanged by this mission. Adding the exported guard is classified PRODUCTION-FUNCTIONALITY-CHANGING even though it is currently opt-in; package scripts and runners are BENCHMARK-INFRA-ONLY, corpus/property checks TEST-ONLY and prose DOCUMENTATION-ONLY. Integrate infrastructure only after review; guard integration needs an independent full-pipeline mission and revalidation.

The corpus, schema and catalog are behavior-neutral integration candidates. Runners are pinned to the readiness snapshot, and final/property scripts depend on the new guard; they are not a drop-in test-only merge onto an older candidate without adapting that wiring and revalidating. No integration is approved or performed here.

Authority is declared fixture metadata. This does not authenticate issuers, URLs, signatures or retrieval candidates. Retrieval rank/long-context budgets are not end-to-end evaluated by the guard, which sees the entire bounded fixture set. OCR examples are text simulations, not scanned PDFs. Hostile-document checks measure refusal to use instructions as evidence; there is no model, secret canary or tool-action execution, so secret nondisclosure and full prompt-injection security remain unmeasured. The parser supports explicit labelled fields and narrow pipe-table/arithmetic grammar, not arbitrary procurement prose. It validates the structured claim field; it does not prove that a free-text question was correctly mapped to that field. Conditional/damaged evidence handling can over-refuse. Provenance ambiguity that depends on real authentication is represented only by its supplied metadata. Conflict labels are scored, but explanatory conflict proof completeness is not: several conflict cases have no gold citation set. Currency support is INR/USD/EUR/GBP; money is bounded to safely representable cent precision, without exchange-rate inference.

**Current conclusion:** the baseline cannot demonstrate reliable claim grounding. The opt-in guard establishes correct proof for 19 accepted claims in this corpus and safely avoids unsupported acceptance, but fails seven decisions and is not integrated. Actual unchanged extraction also has severe coverage/placeholder weaknesses. TenderDelta as a whole is not certified trustworthy by these results.

The next bounded research mission should integrate proof objects into generation, remove ungrounded draft-date placeholders, and evaluate authenticated, de-identified real PDFs through retrieval, extraction, answer generation and UI display using a new independent holdout. Keep this corpus immutable as a regression asset.
