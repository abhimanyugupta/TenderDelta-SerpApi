import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const port = '3107';
const server = spawn(process.execPath, ['dist/server.cjs'], {
  env: { ...process.env, NODE_ENV: 'production', PORT: port, HOST: '127.0.0.1',
    SERPAPI_API_KEY: '', GEMINI_API_KEY: '' },
  stdio: 'ignore', windowsHide: true,
});
const base = `http://127.0.0.1:${port}`;
try {
  let ready = false;
  for (let i = 0; i < 200; i++) {
    try { if ((await fetch(`${base}/api/health`)).ok) { ready = true; break; } } catch {}
    await delay(100);
  }
  assert.ok(ready, 'Production server must start.');
  const health = await (await fetch(`${base}/api/health`)).json();
  assert.equal(health.geminiConfigured, false);
  assert.ok((await (await fetch(base)).text()).includes('<div id="root">'));
  const post = (route: string, body: unknown) => fetch(base + route, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  assert.equal((await post('/api/serpapi/discover-tenders', { query: '' })).status, 400);
  const missing = await post('/api/serpapi/discover-tenders', { query: 'synthetic test query' });
  assert.equal(missing.status, 503);
  assert.equal((await missing.json()).authoritative, false);
  const analysis = await (await post('/api/gemini/analyze-tender', {
    documents: [{ id: 'baseline', name: 'baseline.txt', type: 'ORIGINAL_NIT',
      extractedText: 'Annual financial turnover INR 10 crore.' }],
  })).json();
  assert.deepEqual(analysis.changes, [], 'A baseline requirement must not fabricate an amendment.');
  console.log('Production HTTP smoke passed: app, health, query validation, missing-key fail-closed and baseline-only analysis.');
} finally {
  server.kill();
}
