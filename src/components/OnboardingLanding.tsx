import React from 'react';
import { 
  PlusCircle, 
  Play, 
  FileDiff, 
  Clock, 
  CheckSquare, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles,
  Building2,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

interface OnboardingLandingProps {
  onAnalyseNewTender: () => void;
  onViewDemo: () => void;
}

export const OnboardingLanding: React.FC<OnboardingLandingProps> = ({
  onAnalyseNewTender,
  onViewDemo
}) => {
  return (
    <div className="py-8 sm:py-12 space-y-12 max-w-5xl mx-auto">
      
      {/* Hero Section */}
      <div className="text-center space-y-4">
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>INDIAN GOVERNMENT & PSU TENDER VERSION INTELLIGENCE</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 font-sans tracking-tight leading-tight">
          TENDERDELTA
        </h1>

        {/* The 3 Core Pillars Tagline */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-mono text-sm sm:text-base font-bold text-stone-800 pt-1">
          <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            KNOW WHAT CHANGED.
          </span>
          <span className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            KNOW WHAT IT MEANS.
          </span>
          <span className="text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            KNOW WHAT TO DO.
          </span>
        </div>

        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto font-sans leading-relaxed pt-2">
          Never miss a critical corrigendum again. Track clause evolutions across original NITs, pre-bid responses, addenda, and revised BOQs on CPPP, GeM, and Indian PSUs.
        </p>

        {/* Primary Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
          <button
            id="hero-analyse-btn"
            onClick={onAnalyseNewTender}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs sm:text-sm rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ANALYSE A TENDER</span>
          </button>

          <button
            id="hero-view-demo-btn"
            onClick={onViewDemo}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-mono font-bold text-xs sm:text-sm rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>EXPLORE DEMO WORKBENCH (AI HPC CLUSTER)</span>
          </button>
        </div>
      </div>

      {/* Synthetic Demo Teaser Card */}
      <div className="bg-white border border-stone-300 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-blue-100 text-blue-800">
                CPPP eProcure
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-red-100 text-red-800">
                High Materiality Risk
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-1 font-sans">
              Supply and Deployment of AI-enabled Research Computing Infrastructure
            </h3>
            <p className="text-xs font-mono text-stone-500 mt-0.5">
              IISEAR/PROC/CC/2026/089-T04 • Indian Institute of Science Education & Advanced Research
            </p>
          </div>

          <button
            onClick={onViewDemo}
            className="flex items-center space-x-1.5 px-4 py-2 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold font-mono transition-colors self-start md:self-auto"
          >
            <span>Open Demo Workbench</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Delta Engine Highlight Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-stone-50 rounded border border-stone-200">
            <span className="text-[10px] text-stone-500 uppercase block">Material Changes</span>
            <span className="text-lg font-bold text-stone-900">12 Detected</span>
          </div>

          <div className="p-3 bg-red-50 rounded border border-red-200">
            <span className="text-[10px] text-red-600 uppercase block">Critical Shifts</span>
            <span className="text-lg font-bold text-red-700">2 Clauses</span>
          </div>

          <div className="p-3 bg-amber-50 rounded border border-amber-200">
            <span className="text-[10px] text-amber-700 uppercase block">Submission Deadline</span>
            <span className="text-lg font-bold text-amber-800">+7 Days Shift</span>
          </div>

          <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
            <span className="text-[10px] text-emerald-700 uppercase block">BOM Value Delta</span>
            <span className="text-lg font-bold text-emerald-800">+₹37.4 Lakhs</span>
          </div>
        </div>

        {/* 3 Core Pillars in Action */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs font-sans">
          
          <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-1.5">
            <span className="font-bold text-blue-900 font-mono text-xs block">1. WHAT CHANGED?</span>
            <p className="text-stone-700 leading-relaxed text-[11px]">
              Average annual turnover threshold increased by 50% from ₹10.00 Cr to ₹15.00 Cr in Corrigendum 2.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-1.5">
            <span className="font-bold text-amber-900 font-mono text-xs block">2. WHAT DOES IT MEAN?</span>
            <p className="text-stone-700 leading-relaxed text-[11px]">
              Disqualification barrier if your existing CA certificate only certifies ₹10 Cr compliance.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-1.5">
            <span className="font-bold text-emerald-900 font-mono text-xs block">3. WHAT DO I DO?</span>
            <p className="text-stone-700 leading-relaxed text-[11px]">
              Obtain fresh audited P&L certificate with valid ICAI UDIN for ₹15 Cr threshold before submission.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
