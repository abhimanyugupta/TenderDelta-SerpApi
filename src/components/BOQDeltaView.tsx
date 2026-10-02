import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  ArrowRight, 
  Sparkles, 
  ExternalLink, 
  Download, 
  Plus, 
  Info,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Tender } from '../types';

interface BOQDeltaViewProps {
  tender: Tender;
  onOpenSourceViewer: (docName: string, page: number, snippet: string) => void;
}

export const BOQDeltaView: React.FC<BOQDeltaViewProps> = ({
  tender,
  onOpenSourceViewer
}) => {
  // Interactive cost impact calculator
  const [ramUnitCost, setRamUnitCost] = useState<number>(230000); // INR incremental cost per server for 512GB extra RAM
  const [switchUnitCost, setSwitchUnitCost] = useState<number>(680000); // INR per 100G switch
  const [cableUnitCost, setCableUnitCost] = useState<number>(16500); // INR per AOC cable

  const ramTotalDelta = 8 * ramUnitCost; // 8 servers
  const switchTotalDelta = 2 * switchUnitCost; // 2 extra switches (2 -> 4)
  const cableTotalDelta = 32 * cableUnitCost; // 32 new cables

  const totalIncrementalCost = ramTotalDelta + switchTotalDelta + cableTotalDelta;

  const formatInr = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-amber-50 text-amber-800 border border-amber-200">
                FINANCIAL SCHEDULE DELTA
              </span>
              <span className="text-xs text-stone-500 font-mono">
                Revised_Financial_BOQ_v2.xlsx • 3 Material Line Items
              </span>
            </div>
            <h1 className="text-xl font-bold text-stone-900 mt-1 font-sans">
              Bill of Quantities (BOQ) Delta & Pricing Impact
            </h1>
            <p className="text-xs text-stone-600 max-w-3xl mt-0.5">
              Corrigendum 2 & Pre-Bid adjustments directly modified hardware bill-of-materials. Price with outdated BOQ values leads to non-responsive commercial bids or severe margin erosion.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenSourceViewer('Revised_Financial_BOQ_v2.xlsx', 1, 'Schedule A Item 1.01')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold font-mono transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Inspect BOQ Excel Format</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cost Impact Calculator Card */}
      <div className="bg-stone-900 text-stone-100 rounded-lg p-6 shadow-md border border-stone-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-white">
                Live BOM Pricing Delta Estimator
              </h2>
            </div>
            <p className="text-xs text-stone-400 font-sans mt-0.5">
              Estimated financial impact on your total tender bid price based on Corrigendum 2 BOQ revisions:
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-stone-400 uppercase font-mono block">Estimated Net BOM Delta</span>
            <span className="text-2xl font-bold text-amber-400 font-mono">
              +{formatInr(totalIncrementalCost)}
            </span>
          </div>
        </div>

        {/* Interactive Unit Cost Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-stone-800/80 p-3.5 rounded border border-stone-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-stone-300 font-semibold">1.01 RAM Upgrade (512G → 1TB)</span>
              <span className="text-[10px] text-stone-400">8 Servers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-stone-400">Unit INR:</span>
              <input
                type="number"
                value={ramUnitCost}
                onChange={(e) => setRamUnitCost(Number(e.target.value))}
                className="w-full px-2 py-1 bg-stone-900 border border-stone-600 rounded text-stone-100 font-bold"
              />
            </div>
            <span className="text-[11px] text-amber-300 block font-bold">Subtotal: +{formatInr(ramTotalDelta)}</span>
          </div>

          <div className="bg-stone-800/80 p-3.5 rounded border border-stone-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-stone-300 font-semibold">2.03 Switches (2 → 4 Units)</span>
              <span className="text-[10px] text-stone-400">+2 Units</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-stone-400">Unit INR:</span>
              <input
                type="number"
                value={switchUnitCost}
                onChange={(e) => setSwitchUnitCost(Number(e.target.value))}
                className="w-full px-2 py-1 bg-stone-900 border border-stone-600 rounded text-stone-100 font-bold"
              />
            </div>
            <span className="text-[11px] text-amber-300 block font-bold">Subtotal: +{formatInr(switchTotalDelta)}</span>
          </div>

          <div className="bg-stone-800/80 p-3.5 rounded border border-stone-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-stone-300 font-semibold">2.05 Active Optical Cables</span>
              <span className="text-[10px] text-stone-400">+32 Nos</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-stone-400">Unit INR:</span>
              <input
                type="number"
                value={cableUnitCost}
                onChange={(e) => setCableUnitCost(Number(e.target.value))}
                className="w-full px-2 py-1 bg-stone-900 border border-stone-600 rounded text-stone-100 font-bold"
              />
            </div>
            <span className="text-[11px] text-amber-300 block font-bold">Subtotal: +{formatInr(cableTotalDelta)}</span>
          </div>
        </div>
      </div>

      {/* BOQ Item Comparison Table */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-900 font-mono uppercase tracking-wider">
            Bill of Quantities Comparison Matrix (v1.0 Baseline vs v5.0 Revised)
          </h3>
          <span className="text-xs font-mono text-stone-500">3 Substantive Item Changes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead className="bg-stone-900 text-stone-200 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-20">Item #</th>
                <th className="py-3 px-4">Original BOQ Description & Qty</th>
                <th className="py-3 px-4">Revised BOQ Description & Qty</th>
                <th className="py-3 px-3 text-center">Change Type</th>
                <th className="py-3 px-4">Action for Commercial Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              
              {/* Row 1: RAM */}
              <tr className="hover:bg-stone-50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-stone-900 align-top">
                  1.01
                </td>
                <td className="py-3.5 px-4 align-top max-w-xs space-y-1">
                  <span className="font-semibold text-stone-900 block">AI Compute Server Nodes</span>
                  <span className="text-[11px] text-stone-500 font-mono block">512 GB DDR5 ECC Memory per node</span>
                  <span className="text-xs font-bold font-mono text-stone-700">Quantity: 8 Nos</span>
                </td>
                <td className="py-3.5 px-4 align-top max-w-xs space-y-1 bg-blue-50/40">
                  <span className="font-semibold text-blue-900 block">AI Compute Server Nodes</span>
                  <span className="text-[11px] text-blue-900 font-mono font-bold block">1024 GB (1TB) DDR5 ECC Memory</span>
                  <span className="text-xs font-bold font-mono text-stone-900">Quantity: 8 Nos</span>
                </td>
                <td className="py-3.5 px-3 align-top text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-100 text-blue-800">
                    SPEC DOUBLED
                  </span>
                </td>
                <td className="py-3.5 px-4 align-top text-[11px] text-stone-700 space-y-1">
                  <p className="font-medium">Update OEM server BoM with 16x 64GB DDR5 RDIMMs per server.</p>
                  <button
                    onClick={() => onOpenSourceViewer('Pre_Bid_Clarifications_Reply_Matrix.pdf', 4, 'Query #14 RAM per GPU node')}
                    className="text-blue-600 hover:text-blue-800 font-mono text-[10px] flex items-center font-bold"
                  >
                    <span>View Query #14 Citation</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-1" />
                  </button>
                </td>
              </tr>

              {/* Row 2: Switches */}
              <tr className="hover:bg-stone-50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-stone-900 align-top">
                  2.03
                </td>
                <td className="py-3.5 px-4 align-top max-w-xs space-y-1">
                  <span className="font-semibold text-stone-900 block">100Gbps InfiniBand Quantum HDR Switches</span>
                  <span className="text-xs font-bold font-mono text-stone-700">Quantity: 2 Units</span>
                </td>
                <td className="py-3.5 px-4 align-top max-w-xs space-y-1 bg-amber-50/40">
                  <span className="font-semibold text-amber-900 block">100Gbps InfiniBand Quantum HDR Switches</span>
                  <span className="text-xs font-bold font-mono text-amber-950">Quantity: 4 Units (+100%)</span>
                </td>
                <td className="py-3.5 px-3 align-top text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-100 text-amber-800">
                    QTY DOUBLED
                  </span>
                </td>
                <td className="py-3.5 px-4 align-top text-[11px] text-stone-700 space-y-1">
                  <p className="font-medium">Request revised partner pricing for 4 switch units instead of 2.</p>
                  <button
                    onClick={() => onOpenSourceViewer('Revised_Financial_BOQ_v2.xlsx', 1, 'Schedule A Item 2.03')}
                    className="text-blue-600 hover:text-blue-800 font-mono text-[10px] flex items-center font-bold"
                  >
                    <span>View BOQ v2 Citation</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-1" />
                  </button>
                </td>
              </tr>

              {/* Row 3: AOC Cables */}
              <tr className="hover:bg-stone-50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-stone-900 align-top">
                  2.05
                </td>
                <td className="py-3.5 px-4 align-top max-w-xs text-stone-400 font-mono text-[11px]">
                  [Not present as standalone item in v1.0]
                </td>
                <td className="py-3.5 px-4 align-top max-w-xs space-y-1 bg-emerald-50/40">
                  <span className="font-semibold text-emerald-900 block">100G QSFP28 Active Optical Cables</span>
                  <span className="text-xs font-bold font-mono text-emerald-950">Quantity: 32 Nos</span>
                </td>
                <td className="py-3.5 px-3 align-top text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800">
                    NEW LINE ITEM
                  </span>
                </td>
                <td className="py-3.5 px-4 align-top text-[11px] text-stone-700 space-y-1">
                  <p className="font-medium">Quote item 2.05 unit rate explicitly in Excel sheet. Leaving it blank results in non-responsive bid.</p>
                  <button
                    onClick={() => onOpenSourceViewer('Revised_Financial_BOQ_v2.xlsx', 1, 'Schedule A Item 2.05')}
                    className="text-blue-600 hover:text-blue-800 font-mono text-[10px] flex items-center font-bold"
                  >
                    <span>View BOQ Line 2.05</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-1" />
                  </button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
