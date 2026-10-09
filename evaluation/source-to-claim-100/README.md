# Source-to-claim 100 · dataset v1.0.0

This frozen evaluation package tests whether structured procurement claims are supported by the correct source, exact evidence, and complete citations, while rewarding correct abstention. The full archive contains the 100 cases, schema, expected outcomes, source snapshot, evaluation-only guard, scorer, reproducibility checks, and machine reports. The archive is preserved byte-for-byte; verify it with the included SHA-256 sidecar.

## Results at a glance

| Measurement | Baseline validator | Isolated structured guard |
|---|---:|---:|
| Cases passed | 39/100 | 93/100 |
| Unsupported accepted claims | 60/81 | 0/19 |
| Correct abstentions | 18/74 | 69/74 |
| False abstentions | 0/21 | 2/21 |
| Severity-weighted reliability | 39.69% | 98.22% |
| Maximum observed severity | S5 | S2 |

The 93/100 guard is an opt-in evaluation implementation; it is not connected to the current UI or answer-generation routes. It validates structured proposed claims rather than generating arbitrary text. Its score is not a TenderDelta product reliability estimate or a safety certification.

The unchanged local extractor separately covered only 19/71 explicitly labeled gold fields (26.8%), emitted 100 draft-ingestion-time deadline placeholders over the 100 fixtures, and emitted two unresolved conflicts unsafely. Read [`REPORT.md`](REPORT.md) for category results, denominators, high-severity examples, and limitations. [`CASE_CATALOG.md`](CASE_CATALOG.md) lists the taxonomy and each case's distinct adversarial property.

## Taxonomy

| Category | Cases | Coverage |
|---|---:|---|
| A | 10 | Citation correctness |
| B | 10 | Unsupported and inferred claims |
| C | 10 | Conflicting sources |
| D | 10 | Corrigenda and superseded information |
| E | 8 | Dates and temporal reasoning |
| F | 8 | Amounts, currency, quantities, and arithmetic |
| G | 8 | Entity and tender identity collisions |
| H | 8 | Missing evidence and abstention |
| I | 8 | Extraction noise and formatting corruption |
| J | 6 | Retrieval and distractor sources |
| K | 6 | Hostile document instructions |
| L | 6 | Cross-document provenance |
| R | 2 | Research-style provenance ambiguity and false cross-document inference |
| **Total** | **100** | |

The frozen dataset SHA-256 is `462b64a4f0185dc31b37fc66cffb41e0d38b4e016befef5c713622a2bd8b13c8`.

## Reproduce

1. Download `SOURCE_TO_CLAIM_100_ARTIFACT.zip` and verify it against `SOURCE_TO_CLAIM_100_ARTIFACT.sha256`.
2. Extract it to a clean directory. The archive includes its evaluation-only `package.json`, TypeScript configuration, source snapshot, frozen cases, gold labels, and runner. It does not include `node_modules` or credentials.
3. Use Node.js 24 or newer and make the exact dependencies declared in that package available under your own package-download policy. The evaluation runner itself makes no network or model calls.
4. From the extracted archive root, run:

```sh
npm run test:source-claim
npm run eval:source-claim:baseline
npm run eval:source-claim:development
npm run eval:source-claim:final
npm run eval:source-claim:extraction
```

A zero exit code means the runner completed; inspect its metrics and catastrophic-error gate to determine whether the evaluated system passed. The expected labels and cases are frozen. If you correct a case, publish a new dataset version and retain this archive and reports unchanged.

## Files

- `SOURCE_TO_CLAIM_100_ARTIFACT.zip` — complete reproducible artifact.
- `SOURCE_TO_CLAIM_100_ARTIFACT.sha256` — archive integrity check.
- `REPORT.md` — human-readable evaluation report.
- `BASELINE.json`, `FINAL.json`, `EXTRACTION.json` — machine-readable results.
- `EVALUATION.md` — benchmark design and measurement details.
- `CASE_CATALOG.md` — exact case taxonomy and adversarial properties.
