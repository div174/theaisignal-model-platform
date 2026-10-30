"use client";

import React, { useState, useMemo } from "react";
import { AIModel, CostCalculationResult } from "@/lib/types";
import { BrandLogo } from "./brand-logo";
import { formatCurrency, formatTokens } from "@/lib/data";
import { Calculator, Sparkles, TrendingDown, HelpCircle } from "lucide-react";

interface CostCalculatorProps {
  models: AIModel[];
  className?: string;
}

export function CostCalculator({ models, className = "" }: CostCalculatorProps) {
  // Default values as specified: 5,000,000 input tokens, 1,000,000 output tokens
  const [inputTokens, setInputTokens] = useState<number>(5000000);
  const [outputTokens, setOutputTokens] = useState<number>(1000000);

  // Sanitized handlers
  const handleInputChange = (val: number) => {
    setInputTokens(Math.max(0, isNaN(val) ? 0 : val));
  };

  const handleOutputChange = (val: number) => {
    setOutputTokens(Math.max(0, isNaN(val) ? 0 : val));
  };

  // Preset workload helpers
  const applyPreset = (inTok: number, outTok: number) => {
    setInputTokens(inTok);
    setOutputTokens(outTok);
  };

  // Perform calculations memoized with zero-lag updates
  const calculations: CostCalculationResult[] = useMemo(() => {
    if (!models || models.length === 0) return [];

    const results = models.map((model) => {
      const inPrice = model.cost.input ?? 0;
      const outPrice = model.cost.output ?? 0;

      // Formula: ((Input Tokens / 1,000,000) * Input Price) + ((Output Tokens / 1,000,000) * Output Price)
      const inputCost = (inputTokens / 1000000) * inPrice;
      const outputCost = (outputTokens / 1000000) * outPrice;
      const totalMonthlyCost = inputCost + outputCost;

      return {
        modelId: model.id,
        modelName: model.name,
        lab: model.lab,
        inputCost,
        outputCost,
        totalMonthlyCost,
        isLowestBill: false,
        savingsVsNextBest: null as number | null,
      };
    });

    if (results.length === 0) return [];

    // Find lowest total monthly cost
    const sorted = [...results].sort((a, b) => a.totalMonthlyCost - b.totalMonthlyCost);
    const lowestCost = sorted[0].totalMonthlyCost;
    const secondLowestCost = sorted.length > 1 ? sorted[1].totalMonthlyCost : null;
    const savings = secondLowestCost !== null ? Math.max(0, secondLowestCost - lowestCost) : null;

    return results.map((item) => {
      const isLowest = item.totalMonthlyCost === lowestCost && results.length > 1;
      return {
        ...item,
        isLowestBill: isLowest,
        savingsVsNextBest: isLowest ? savings : null,
      };
    });
  }, [models, inputTokens, outputTokens]);

  if (!models || models.length === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white/90 p-5 sm:p-7 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/70 backdrop-blur-sm transition-colors ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
                Interactive Monthly Cost Estimator
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Simulate prompt and completion volume to compare real-world infrastructure bills.
              </p>
            </div>
          </div>
        </div>

        {/* Workload Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 mr-1">Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset(1000000, 200000)}
            className="px-2.5 py-1 text-xs rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
          >
            MVP (1M / 200K)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(5000000, 1000000)}
            className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
              inputTokens === 5000000 && outputTokens === 1000000
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500/50 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300"
            }`}
          >
            Standard (5M / 1M)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(25000000, 5000000)}
            className="px-2.5 py-1 text-xs rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
          >
            RAG / Agents (25M / 5M)
          </button>
        </div>
      </div>

      {/* Sliders and Numerical Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Input Tokens */}
        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 dark:border-zinc-800/80 dark:bg-zinc-950/50 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
              Monthly Prompt (Input) Tokens
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                step="500000"
                value={inputTokens}
                onChange={(e) => handleInputChange(Number(e.target.value))}
                className="w-36 px-2.5 py-1 text-right text-sm font-mono font-medium rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <span className="text-xs text-slate-400 dark:text-zinc-500">tokens</span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="50000000"
            step="250000"
            value={inputTokens}
            onChange={(e) => handleInputChange(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
            <span>0</span>
            <span className="font-semibold text-slate-700 dark:text-zinc-300">
              {formatTokens(inputTokens)} tokens (~{(inputTokens / 1000000).toFixed(2)}M)
            </span>
            <span>50M</span>
          </div>
        </div>

        {/* Output Tokens */}
        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 dark:border-zinc-800/80 dark:bg-zinc-950/50 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
              Monthly Completion (Output) Tokens
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                step="200000"
                value={outputTokens}
                onChange={(e) => handleOutputChange(Number(e.target.value))}
                className="w-36 px-2.5 py-1 text-right text-sm font-mono font-medium rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <span className="text-xs text-slate-400 dark:text-zinc-500">tokens</span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="15000000"
            step="100000"
            value={outputTokens}
            onChange={(e) => handleOutputChange(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
            <span>0</span>
            <span className="font-semibold text-slate-700 dark:text-zinc-300">
              {formatTokens(outputTokens)} tokens (~{(outputTokens / 1000000).toFixed(2)}M)
            </span>
            <span>15M</span>
          </div>
        </div>
      </div>

      {/* Model Estimates Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {calculations.map((res) => {
          const modelObj = models.find((m) => m.id === res.modelId);
          return (
            <div
              key={res.modelId}
              className={`relative rounded-xl p-4 transition-all ${
                res.isLowestBill
                  ? "border-2 border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-md shadow-emerald-500/10"
                  : "border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60"
              }`}
            >
              {/* Best Value Badge */}
              {res.isLowestBill && (
                <div className="absolute -top-3 left-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500 text-slate-950 shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>Lowest Bill / Best Value</span>
                </div>
              )}

              {/* Model Header */}
              <div className="flex items-center gap-2 mt-1 mb-3">
                <BrandLogo lab={res.lab} size="sm" />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">
                    {res.modelName}
                  </h4>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 truncate block font-mono">
                    {res.modelId}
                  </span>
                </div>
              </div>

              {/* Total Monthly Bill */}
              <div className="py-2.5 my-2 border-y border-slate-100 dark:border-zinc-800/80">
                <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-zinc-500 block">
                  Estimated Monthly Total
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100 font-mono">
                    {formatCurrency(res.totalMonthlyCost)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400">/mo</span>
                </div>

                {/* Savings Callout */}
                {res.isLowestBill && res.savingsVsNextBest !== null && res.savingsVsNextBest > 0 && (
                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Saves {formatCurrency(res.savingsVsNextBest)}/mo vs next best
                    </span>
                  </div>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                  <span>Input ({formatCurrency(modelObj?.cost.input ?? 0)}/1M):</span>
                  <span className="font-mono text-slate-800 dark:text-zinc-200">
                    {formatCurrency(res.inputCost)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                  <span>Output ({formatCurrency(modelObj?.cost.output ?? 0)}/1M):</span>
                  <span className="font-mono text-slate-800 dark:text-zinc-200">
                    {formatCurrency(res.outputCost)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Formula Note */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Formula: (Input Tokens / 1M × Input Rate) + (Output Tokens / 1M × Output Rate)</span>
        </div>
        <span className="font-mono">Real-time calculations</span>
      </div>
    </div>
  );
}
