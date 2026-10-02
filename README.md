# TenderDelta × SerpApi

TenderDelta is an evidence-first procurement intelligence application with a narrow SerpApi-powered discovery layer.

## What SerpApi does here

SerpApi provides current public-web search results for procurement discovery intents such as tenders, corrigenda, BOQs, amendments, and procurement documents.

Search output is deliberately treated as **discovery only**:

- provenance: `SEARCH_DISCOVERY`
- authoritative: `false`

A search result or snippet never becomes authoritative tender evidence by itself. The user selects a candidate source, and the source document then enters TenderDelta's existing evidence ingestion and deterministic citation-validation flow.

## Existing-project disclosure

TenderDelta predates the SerpApi India Hackathon 2026. The SerpApi integration is a bounded addition to the existing application rather than a replacement of its evidence-verification architecture.

## Architecture

```
User intent
   ↓
SerpApi Google Search API
   ↓
Discovery leads
   ↓
User selects source
   ↓
TenderDelta document ingestion
   ↓
Deterministic evidence validation
   ↓
Grounded tender analysis
```

The API key is server-side only and must never be committed or exposed in the UI.

## Live benchmark

The canonical remote TenderDelta feature branch was tested with a bounded 10-query live benchmark:

- 10/10 requests successful
- 10/10 cases usable
- 8/10 cases contained an official-domain candidate
- 9.0 average organic results per query
- 10/10 HTTP 200 responses
- all predeclared acceptance gates passed

GitHub Actions run: `SerpApi Live TenderDelta Benchmark #4` (run 37048899011).

## Local development

Requirements:

- Node.js 20+
- npm
- SerpApi API key for live discovery

```bash
npm install
```

Create `.env`:

```env
SERPAPI_API_KEY=your_serpapi_key
```

Start:

```bash
npm run dev
```

Never commit secrets.

## Verification

```bash
npm run test:serpapi
npm run lint
npm run build
```

The canonical remote verification gate has passed fixture tests, TypeScript validation, and production build on the integration branch.

## Security / provenance boundary

SerpApi search output is untrusted discovery data. TenderDelta preserves that distinction throughout the workflow. Authoritative claims require source-document ingestion and deterministic citation validation.
