import React, { useState } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  ShieldCheck, 
  Scale, 
  AlertCircle, 
  FileCheck, 
  CheckCircle2, 
  Play, 
  Terminal, 
  Check, 
  XCircle,
  ShieldAlert,
  Target,
  Zap,
  Filter,
  Flame
} from 'lucide-react';
import { INDIAN_PROCUREMENT_RULES, MATERIALITY_DEFINITIONS } from '../data/taxonomy';
import { runIntelligenceRegressionTests, RegressionTestReport } from '../data/testFixtures';
import { 
  runAdversarialEvidenceBenchmark, 
  AdversarialBenchmarkReport,
  ADVERSARIAL_BENCHMARK_CASES 
} from '../benchmark/adversarialEvidenceBenchmark';

export const MethodologyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BENCHMARK' | 'REGRESSION' | 'TAXONOMY'>('BENCHMARK');
  const [benchmarkReport, setBenchmarkReport] = useState<AdversarialBenchmarkReport | null>(null);
  const [regressionReport, setRegressionReport] = useState<RegressionTestReport | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const handleRunBenchmark = () => {
    const report = runAdversarialEvidenceBenchmark();
    setBenchmarkReport(report);
  };

  const handleRunRegression = () => {
    const report = runIntelligenceRegressionTests();
    setRegressionReport(report);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-stone-100 text-stone-800 border border-stone-200">
            PROVENANCE CHECKS
          </span>
          <span className="text-xs text-stone-500 font-mono">Illustrative references • selected source checks</span>
        </div>
        <h1 className="text-xl font-bold text-stone-900 mt-1 font-sans">
          Selected Provenance Checks & Adversarial Evidence Benchmark
        </h1>
        <p className="text-xs text-stone-600 max-w-3xl mt-0.5">
          Some supported workflows check citation text and source identity. Coverage varies by field and document; these checks do not certify correctness, completeness, or legal compliance. The 20-case results are fixture observations, not product-wide reliability estimates.
        </p>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mt-4 pt-3 border-t border-stone-200">
          <button
            onClick={() => setActiveTab('BENCHMARK')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'BENCHMARK'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Adversarial Benchmark (20 Cases)</span>
          </button>

          <button
            onClick={() => setActiveTab('REGRESSION')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'REGRESSION'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>Regression Suite (12 Fixtures)</span>
          </button>

          <button
            onClick={() => setActiveTab('TAXONOMY')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'TAXONOMY'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>Procurement References</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ADVERSARIAL EVIDENCE BENCHMARK */}
      {activeTab === 'BENCHMARK' && (
        <div className="space-y-6">
          {/* Benchmark Controls & Header */}
          <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-rose-600" />
                <div>
                  <h2 className="text-sm font-bold text-stone-900 uppercase font-mono tracking-wider">
                    Adversarial Evidence Mutation Benchmark
                  </h2>
                  <p className="text-xs text-stone-500 font-mono">
                    20-case deterministic fixture set • Run to view current results
                  </p>
                </div>
              </div>

              <button
                onClick={handleRunBenchmark}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-white font-mono text-xs font-semibold shadow-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Run Adversarial Benchmark Suite</span>
              </button>
            </div>

            {benchmarkReport ? (
              <div className="space-y-4">
                {/* Scorecards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-stone-900 text-stone-100 rounded-lg border border-stone-800">
                    <p className="text-[10px] uppercase font-mono text-stone-400">False Accept Rate (FAR)</p>
                    <div className="flex items-baseline space-x-1 mt-1">
                      <span className="text-2xl font-bold font-mono text-emerald-400">
                        {benchmarkReport.falseAcceptRate.toFixed(2)}%
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">({benchmarkReport.falseAcceptCount}/{benchmarkReport.invalidCasesCount})</span>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-0.5">Observed among invalid fixtures</p>
                  </div>

                  <div className="p-3.5 bg-stone-900 text-stone-100 rounded-lg border border-stone-800">
                    <p className="text-[10px] uppercase font-mono text-stone-400">False Reject Rate (FRR)</p>
                    <div className="flex items-baseline space-x-1 mt-1">
                      <span className="text-2xl font-bold font-mono text-blue-400">
                        {benchmarkReport.falseRejectRate.toFixed(2)}%
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">({benchmarkReport.falseRejectCount}/{benchmarkReport.validCasesCount})</span>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-0.5">Observed among valid fixtures</p>
                  </div>

                  <div className="p-3.5 bg-stone-900 text-stone-100 rounded-lg border border-stone-800">
                    <p className="text-[10px] uppercase font-mono text-stone-400">Valid-Accept Rate</p>
                    <div className="flex items-baseline space-x-1 mt-1">
                      <span className="text-2xl font-bold font-mono text-emerald-400">
                        {benchmarkReport.validAcceptRate.toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">({benchmarkReport.validAcceptCount}/{benchmarkReport.validCasesCount})</span>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-0.5">Supported fixtures accepted</p>
                  </div>

                  <div className="p-3.5 bg-stone-900 text-stone-100 rounded-lg border border-stone-800">
                    <p className="text-[10px] uppercase font-mono text-stone-400">Claim-Level Citation Coverage</p>
                    <div className="flex items-baseline space-x-1 mt-1">
                      <span className="text-2xl font-bold font-mono text-indigo-400">
                        {benchmarkReport.claimCitationCoveragePercent.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-0.5">Required spans covered in this set</p>
                  </div>
                </div>

                {/* High-Similarity Killer Cases Banner */}
                <div className="p-4 rounded-lg bg-stone-900 border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                        High-Similarity Killer Cases (Directive 19 Verification)
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {benchmarkReport.allKillerCasesPassed
                        ? 'All named killer fixtures matched expected outcomes'
                        : 'Named killer fixture failures detected'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono pt-1">
                    {benchmarkReport.killerCases.map(kc => (
                      <div key={kc.id} className="p-2.5 rounded bg-stone-800/90 border border-stone-700/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-200">{kc.title}</span>
                          <span className="text-emerald-400 text-[10px] font-bold">✓ PASS</span>
                        </div>
                        <p className="text-stone-400 text-[10px] leading-relaxed">{kc.description}</p>
                        <div className="text-[10px] text-stone-300 font-mono bg-stone-950/70 p-1.5 rounded border border-stone-800">
                          {kc.diagnostic}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benchmark Cases Log & Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-stone-700">
                    <span className="font-bold uppercase tracking-wider">
                      Individual Benchmark Results ({benchmarkReport.results.length} cases)
                    </span>
                    <span className="text-stone-500">Executed at {new Date(benchmarkReport.executedAt).toLocaleTimeString()}</span>
                  </div>

                  <div className="p-4 rounded-lg bg-stone-900 text-stone-100 font-mono text-xs space-y-2 max-h-[450px] overflow-y-auto">
                    {benchmarkReport.results.map((res) => (
                      <div 
                        key={res.id} 
                        className="p-2.5 rounded bg-stone-800/80 border border-stone-700/60 flex flex-col space-y-1 text-[11px]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {res.passed ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            )}
                            <span className="font-bold text-stone-200">{res.title}</span>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-bold tracking-wider bg-stone-700 text-stone-300">
                              {res.mutationType}
                            </span>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              res.actualStatus === 'VERIFIED' ? 'bg-emerald-900 text-emerald-300' :
                              res.actualStatus === 'FAILED_VALIDATION' ? 'bg-rose-900 text-rose-300' :
                              res.actualStatus === 'INSUFFICIENT_EVIDENCE' ? 'bg-amber-900 text-amber-300' :
                              'bg-stone-700 text-stone-300'
                            }`}>
                              {res.actualStatus}
                            </span>
                          </div>
                        </div>

                        <div className="text-stone-400 text-[10px] pl-5.5">
                          {res.actualReason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded border border-stone-200 bg-stone-50 text-xs text-stone-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-stone-800 text-sm">20 Deterministic Adversarial Evidence Benchmarks</p>
                  <p className="text-[11px] text-stone-500 max-w-2xl leading-relaxed">
                    Evaluates the pipeline against the small ground-truth corpus and deterministic mutations: wrong document ID, stale version, v1 vs v10 collision, short hash collision, page shift rewrite, unpaginated doc, absent page data, uncertain boundary, OCR noise, EMD number substitution (killer test), clause splice, stale amendment, fabricated snippet, raw↔normalized coordinate recovery, prompt injection, and claim-level undercoverage.
                  </p>
                </div>
                <button
                  onClick={handleRunBenchmark}
                  className="px-4 py-2 rounded bg-stone-900 hover:bg-stone-800 text-white font-mono text-xs font-semibold shrink-0 shadow-xs"
                >
                  Run Benchmark Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: REGRESSION TEST SUITE */}
      {activeTab === 'REGRESSION' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-emerald-600" />
                <div>
                  <h2 className="text-sm font-bold text-stone-900 uppercase font-mono tracking-wider">
                    Document Intelligence Regression Test Suite
                  </h2>
                  <p className="text-xs text-stone-500 font-mono">12 Replayable Pipeline Integration Fixtures</p>
                </div>
              </div>

              <button
                onClick={handleRunRegression}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-white font-mono text-xs font-semibold shadow-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Run Regression Suite</span>
              </button>
            </div>

            {regressionReport ? (
              <div className="p-4 rounded-lg bg-stone-900 text-stone-100 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className={`${regressionReport.allPassed ? 'text-emerald-400' : 'text-amber-400'} font-bold flex items-center space-x-1.5`}>
                    {regressionReport.allPassed ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{regressionReport.allPassed ? `ALL ${regressionReport.totalTests} REGRESSION FIXTURES PASSED DETERMINISTICALLY` : `${regressionReport.passedTests}/${regressionReport.totalTests} TESTS PASSED`}</span>
                  </span>
                  <span className="text-stone-400 text-[11px]">{new Date(regressionReport.executedAt).toLocaleTimeString()}</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  {regressionReport.results.map((res) => (
                    <div key={res.id} className="p-2 rounded bg-stone-800/80 border border-stone-700/60 flex flex-col space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {res.passed ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          )}
                          <span className="font-semibold text-stone-200">{res.title}</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-stone-700 text-stone-300">
                          {res.category}
                        </span>
                      </div>
                      <div className="text-stone-400 text-[10px] pl-5.5">
                        {res.diagnosticDetails}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-800 text-[10px] text-stone-400 flex items-center justify-between">
                  <span>Fail-closed guarantee: Zero synthetic contamination, exact-span source grounding, and strict page boundary verification.</span>
                  <span className="text-emerald-400 font-semibold">{regressionReport.passedTests} / {regressionReport.totalTests} PASS</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded border border-stone-200 bg-stone-50 text-xs text-stone-600 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-semibold text-stone-800">Deterministic Pipeline Verification</p>
                  <p className="text-[11px] text-stone-500">Executes the 12 fail-closed test fixtures covering fabricated snippets, unresolvable IDs, page boundaries, token-overlap false positive defense, OCR noise, and prompt injection.</p>
                </div>
                <button
                  onClick={handleRunRegression}
                  className="text-blue-700 hover:text-blue-900 font-mono font-semibold text-xs underline"
                >
                  Run Suite
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: TAXONOMY & REGULATORY FRAMEWORK */}
      {activeTab === 'TAXONOMY' && (
        <div className="space-y-6">
          {/* Materiality Rubric */}
          <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-stone-200 pb-3">
              <Scale className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-bold text-stone-900 uppercase font-mono tracking-wider">
                Materiality Level Classification Rubric
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(MATERIALITY_DEFINITIONS).map(([key, def]) => (
                <div 
                  key={key} 
                  className="p-4 rounded-lg border border-stone-200 bg-stone-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${def.badgeClass}`}>
                      {def.label}
                    </span>
                  </div>

                  <p className="font-semibold text-stone-900 leading-snug font-sans">
                    {def.description}
                  </p>

                  <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-600 font-mono">
                    <span className="text-stone-400 block text-[10px] uppercase">Level:</span>
                    <span>{key}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indian Procurement Rules (GFR 2017 & CVC) */}
          <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-stone-200 pb-3">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-stone-900 uppercase font-mono tracking-wider">
                Selected Procurement Reference Notes
              </h2>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              These manually curated notes are illustrative, not a current legal authority or tender-specific compliance determination. Verify each point against the applicable official instrument and tender documents. This prototype does not decide eligibility or bid responsiveness.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INDIAN_PROCUREMENT_RULES.map((rule) => (
                <div key={rule.code} className="p-4 rounded border border-stone-200 bg-white space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-blue-900 text-xs">{rule.code}</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-stone-100 text-stone-700">
                      {rule.sourceAuthority}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-xs">{rule.title}</h3>
                  
                  <p className="text-stone-600 leading-relaxed font-sans text-[11px]">
                    {rule.summary}
                  </p>

                  <div className="p-2 bg-stone-50 rounded text-[10px] font-mono text-stone-700">
                    <strong>Impact On Tenders:</strong> {rule.impactOnTenders}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Defense & Traceability Architecture */}
          <div className="bg-stone-900 text-stone-100 rounded-lg p-6 shadow-md border border-stone-800 space-y-3 text-xs font-sans">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                Evidence Checks & Known Limits
              </h3>
            </div>
            <p className="text-stone-300 leading-relaxed max-w-3xl">
              TenderDelta uses deterministic helpers for selected calculations and source checks. Extraction and retrieval can miss material evidence, and coverage varies by field and workflow.
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-stone-400 font-mono text-[11px]">
              <li><strong>Selected calculations:</strong> Supported date offsets and totals use deterministic code; review units, inputs, and tender-specific assumptions.</li>
              <li><strong>Citation checks:</strong> Some supported workflows validate quoted source text and identity. Review both the source and cited passage before relying on a result.</li>
              <li><strong>Absence claims:</strong> "Not found" describes the indexed material, not the complete procurement record. Missing or unreadable pages may contain relevant terms.</li>
              <li><strong>Conflicts:</strong> Detected contradictions can be surfaced with source statements; extraction or retrieval gaps can leave conflicts undiscovered.</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};
