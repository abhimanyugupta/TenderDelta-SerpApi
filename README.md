# TenderDelta × SerpApi

TenderDelta is a prototype workspace for comparing procurement notices, corrigenda, clarifications, and revised BOQs. The SerpApi integration helps users discover candidate public sources; source discovery and claim verification remain separate steps.

## Demo video

[Watch the 1:42 TenderDelta demo](demo/TenderDelta-SerpApi-Hackathon.mp4). It uses synthetic TenderDelta examples and the deterministic discovery fixture. The displayed fixture records are not live SerpApi search results.

## What the SerpApi integration does

The server can query SerpApi for public-web results about tenders, corrigenda, BOQs, amendments, and related procurement documents. Search results are labeled `SEARCH_DISCOVERY` and `authoritative: false`. A snippet or result URL is a lead, not evidence for a procurement claim. Users must select and ingest the source document before TenderDelta can cite it.

The intended evidence path is:

```text
Search intent → SerpApi discovery result → user-selected source document
              → document ingestion → evidence checks → human review
```

The SerpApi key stays on the server. Fixture mode is deterministic and does not call SerpApi. Live discovery requires a configured `SERPAPI_API_KEY` and makes external API requests.

## Existing-project disclosure

TenderDelta predates the SerpApi India Hackathon 2026. This repository packages the existing application with a bounded SerpApi discovery integration; it does not claim that the entire application was built for the competition.

## Run locally

Requirements: Node.js 20+ and Bun 1.4.2.

```sh
bun install --frozen-lockfile
bun run dev
```

Open `http://localhost:3000`. The example data and discovery fixture work without API credentials. To enable live SerpApi discovery, create a local `.env` from `.env.example` and set `SERPAPI_API_KEY`. `GEMINI_API_KEY` is optional and enables server-side model-assisted analysis. Keep `.env` private; never commit real credentials.

The prototype does not provide sign-in, server-enforced role permissions, or tenant isolation. When Gemini is configured, text sent for analysis is processed by the configured provider. Review that provider's current terms and add deployment security controls before using real confidential procurement documents.

## Verification

```sh
bun run test:all
bun run lint
bun run build
```

After building, `bun run test:server` checks the local server readiness endpoints. `bun run benchmark:serpapi-live` is an optional live network/API benchmark and is not part of the offline test suite.

The current suite includes a 20-case deterministic evidence benchmark, regression checks, and additional server, UI, and readiness tests. It is useful for these bounded behaviors; it does not establish general reliability for open-ended model-generated claims.

## Change classification in this public snapshot

- **BENCHMARK-INFRA-ONLY:** the frozen source-to-claim-100 archive, scorer, and reports. Its proposed-claim guard is not wired into production routes.
- **TEST-ONLY:** new server-readiness, evidence-readiness, and UI regression checks.
- **DOCUMENTATION-ONLY:** this README, the demo video notes, and the evaluation summary.
- **PRODUCTION-FUNCTIONALITY-CHANGING:** evidence and server hardening, conservative handling of failed extraction/model calls, safer SerpApi result filtering and diagnostics, and UI copy that removes unsupported privacy/compliance guarantees and invented user identities.

The production changes were checked by the deterministic suite, TypeScript validation, production build, and a local HTTP smoke test. The separate 100-case guard remains evaluation-only.

## Source-to-claim 100 evaluation

The frozen dataset and evaluator are available in [`evaluation/source-to-claim-100`](evaluation/source-to-claim-100). The archive contains exactly 100 deterministic synthetic cases across citation correctness, unsupported claims, conflicts, amendments, dates, numeric extraction, entity collisions, missing evidence, extraction noise, retrieval, hostile document instructions, cross-document provenance, and two research-style cases. Its SHA-256 sidecar is included.

The measured existing quote-validation baseline passed **39/100**. A separate opt-in structured evidence guard passed **93/100**, with **0 unsupported accepted claims among 19 accepted claims**, but it remains disconnected from this app's UI and answer-generation routes. It also falsely abstained on 2 of 21 supported cases. The 93/100 result is not this product's live reliability score or a safety certification.

The unchanged extractor audit found only **19/71 explicit gold fields extracted (26.8% coverage)**, 100 draft-ingestion-time deadline placeholders across the fixtures, and 2 unsafe unresolved conflict emissions. These are material product gaps. On the evidence measured here, **TenderDelta cannot yet demonstrate reliably grounded procurement claims with complete citations and safe extraction**.

The study is synthetic and intentionally bounded. Its adapters validate structured proposed claims rather than generate arbitrary natural-language answers; the deterministic scorer checks annotated proof spans rather than general semantic entailment. The 25-case held-out split is not stratified and is not an independently sampled certification set. See the full report for denominators, failure severities, category breakdown, and limitations.

## Historical live discovery benchmark

A prior bounded 10-query benchmark on the audited TenderDelta feature branch returned 10/10 successful responses, 10/10 usable cases, and an official-domain candidate in 8/10 cases. This measured discovery result availability only; it did not establish issuer authenticity, document currentness, or claim correctness. It is a historical run, not a guarantee of present API behavior.

No live SerpApi request was made while preparing this repository snapshot. The historical live benchmark applies to its pinned earlier code; rerun it with an authorized API key before treating it as validation of these changes.

## Intended use

TenderDelta is a decision-support prototype, not legal advice, a procurement compliance certification, or a substitute for reading the current official tender documents. Verify every material claim, date, amount, and citation with the issuing authority before acting.
