"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { AIModel } from "@/lib/types";
import { BrandLogo } from "./brand-logo";
import { formatContext, formatCurrency } from "@/lib/data";
import {
  FileText,
  Image as ImageIcon,
  Mic,
  Video,
  FileCode2,
  Sparkles,
  ArrowRight,
  X,
  Server,
  Zap,
} from "lucide-react";

interface ComparisonTableProps {
  models: AIModel[];
  onRemoveModel: (modelId: string) => void;
}

export function ComparisonTable({ models, onRemoveModel }: ComparisonTableProps) {
  // Compute lowest prices across the compared models for emerald highlights
  const { lowestInputPrice, lowestOutputPrice } = useMemo(() => {
    if (!models || models.length === 0) {
      return { lowestInputPrice: null, lowestOutputPrice: null };
    }
    const inputPrices = models.map((m) => m.cost.input).filter((p) => typeof p === "number");
    const outputPrices = models.map((m) => m.cost.output).filter((p) => typeof p === "number");

    return {
      lowestInputPrice: inputPrices.length > 0 ? Math.min(...inputPrices) : null,
      lowestOutputPrice: outputPrices.length > 0 ? Math.min(...outputPrices) : null,
    };
  }, [models]);

  if (models.length < 2) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/30">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-zinc-200">
          Select at least 2 models to compare technical specs and cost
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto mt-1">
          Add models from the selector above or browse models to compare benchmarks, token pricing, context windows, and hosting providers.
        </p>
      </div>
    );
  }

  // Modality icon renderer
  const renderModalityIcon = (mod: string) => {
    switch (mod) {
      case "text":
        return <span title="Text"><FileText className="w-3.5 h-3.5" /></span>;
      case "image":
        return <span title="Image / Vision"><ImageIcon className="w-3.5 h-3.5" /></span>;
      case "pdf":
        return <span title="PDF Document"><FileCode2 className="w-3.5 h-3.5" /></span>;
      case "audio":
        return <span title="Audio"><Mic className="w-3.5 h-3.5" /></span>;
      case "video":
        return <span title="Video"><Video className="w-3.5 h-3.5" /></span>;
      default:
        return <span>{mod}</span>;
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-sm transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <tbody>
            {/* 1. MODEL HEADER ROW */}
            <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/40">
              <td className="sticky left-0 z-10 w-48 p-4 bg-slate-50 dark:bg-zinc-900 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 border-r border-slate-200 dark:border-zinc-800">
                Model & Lab
              </td>
              {models.map((model) => (
                <td key={model.id} className="p-4 align-top min-w-[200px] max-w-[280px]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <BrandLogo lab={model.lab} size="md" />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-zinc-100 text-sm">
                            {model.name}
                          </span>
                          {model.isNew && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase">
                              NEW
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500 block">
                          {model.labName}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveModel(model.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 dark:text-zinc-500">
                    Released: {model.releaseDate || "N/A"}
                  </div>
                </td>
              ))}
            </tr>

            {/* 2. CONTEXT WINDOW ROW */}
            <tr className="border-b border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50/50 dark:hover:bg-zinc-900/20">
              <td className="sticky left-0 z-10 p-4 bg-white dark:bg-zinc-950 text-xs font-semibold text-slate-600 dark:text-zinc-400 border-r border-slate-200 dark:border-zinc-800">
                Context Window
              </td>
              {models.map((model) => (
                <td key={model.id} className="p-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold font-mono text-slate-900 dark:text-zinc-100">
                      {formatContext(model.context)}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-zinc-500">tokens</span>
                  </div>
                  {model.outputTokensLimit && (
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 block">
                      Max output: {formatContext(model.outputTokensLimit)}
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* 3. MODALITIES ROW */}
            <tr className="border-b border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50/50 dark:hover:bg-zinc-900/20">
              <td className="sticky left-0 z-10 p-4 bg-white dark:bg-zinc-950 text-xs font-semibold text-slate-600 dark:text-zinc-400 border-r border-slate-200 dark:border-zinc-800">
                Modalities
              </td>
              {models.map((model) => (
                <td key={model.id} className="p-4">
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-zinc-500 block">
                        Input:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {model.input.map((mod) => (
                          <span
                            key={mod}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-zinc-800/80 dark:text-zinc-300 capitalize"
                          >
                            {renderModalityIcon(mod)}
                            <span>{mod}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-zinc-500 block">
                        Output:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {model.output.map((mod) => (
                          <span
                            key={mod}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-zinc-800/80 dark:text-zinc-300 capitalize"
                          >
                            {renderModalityIcon(mod)}
                            <span>{mod}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>

            {/* 4. TOKEN PRICING: INPUT PRICE */}
            <tr className="border-b border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50/50 dark:hover:bg-zinc-900/20">
              <td className="sticky left-0 z-10 p-4 bg-white dark:bg-zinc-950 text-xs font-semibold text-slate-600 dark:text-zinc-400 border-r border-slate-200 dark:border-zinc-800">
                Input Price / 1M Tokens
              </td>
              {models.map((model) => {
                const isLowest =
                  lowestInputPrice !== null &&
                  model.cost.input === lowestInputPrice &&
                  models.length > 1;

                return (
                  <td key={model.id} className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-zinc-100 text-base">
                        {formatCurrency(model.cost.input)}
                      </span>
                      {isLowest && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          <Zap className="w-2.5 h-2.5" />
                          Lowest
                        </span>
                      )}
                    </div>
                    {model.cost.cacheRead !== undefined && model.cost.cacheRead !== null && (
                      <span className="text-[11px] text-slate-400 dark:text-zinc-500 block font-mono">
                        Cache read: {formatCurrency(model.cost.cacheRead)}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* 4. TOKEN PRICING: OUTPUT PRICE */}
            <tr className="border-b border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50/50 dark:hover:bg-zinc-900/20">
              <td className="sticky left-0 z-10 p-4 bg-white dark:bg-zinc-950 text-xs font-semibold text-slate-600 dark:text-zinc-400 border-r border-slate-200 dark:border-zinc-800">
                Output Price / 1M Tokens
              </td>
              {models.map((model) => {
                const isLowest =
                  lowestOutputPrice !== null &&
                  model.cost.output === lowestOutputPrice &&
                  models.length > 1;

                return (
                  <td key={model.id} className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-zinc-100 text-base">
                        {formatCurrency(model.cost.output)}
                      </span>
                      {isLowest && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          <Zap className="w-2.5 h-2.5" />
                          Lowest
                        </span>
                      )}
                    </div>
                    {model.cost.cacheWrite !== undefined && model.cost.cacheWrite !== null && (
                      <span className="text-[11px] text-slate-400 dark:text-zinc-500 block font-mono">
                        Cache write: {formatCurrency(model.cost.cacheWrite)}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* 5. BENCHMARKS */}
            <tr className="border-b border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50/50 dark:hover:bg-zinc-900/20">
              <td className="sticky left-0 z-10 p-4 bg-white dark:bg-zinc-950 text-xs font-semibold text-slate-600 dark:text-zinc-400 border-r border-slate-200 dark:border-zinc-800">
                Benchmarks
              </td>
              {models.map((model) => (
                <td key={model.id} className="p-4">
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-500 dark:text-zinc-400 mb-0.5">
                        <span>Intelligence</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">
                          {model.intelligence ?? "N/A"}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, ((model.intelligence ?? 0) / 70) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-500 dark:text-zinc-400 mb-0.5">
                        <span>Coding</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">
                          {model.coding ?? "N/A"}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, ((model.coding ?? 0) / 70) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-500 dark:text-zinc-400 mb-0.5">
                        <span>Agentic</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">
                          {model.agentic ?? "N/A"}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, ((model.agentic ?? 0) / 70) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>

            {/* 6. ACTIVE HOSTING PROVIDERS */}
            <tr className="border-b border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50/50 dark:hover:bg-zinc-900/20">
              <td className="sticky left-0 z-10 p-4 bg-white dark:bg-zinc-950 text-xs font-semibold text-slate-600 dark:text-zinc-400 border-r border-slate-200 dark:border-zinc-800">
                Active Providers
              </td>
              {models.map((model) => (
                <td key={model.id} className="p-4">
                  <div className="flex flex-wrap gap-1.5">
                    {model.providers.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 text-slate-700 dark:bg-zinc-900 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 capitalize"
                      >
                        <Server className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                        <span>{p}</span>
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* 7. ACTION / PLAYGROUND BUTTON */}
            <tr className="bg-slate-50/40 dark:bg-zinc-900/20">
              <td className="sticky left-0 z-10 p-4 bg-slate-50 dark:bg-zinc-900 text-xs font-bold text-slate-500 dark:text-zinc-400 border-r border-slate-200 dark:border-zinc-800">
                Actions
              </td>
              {models.map((model) => (
                <td key={model.id} className="p-4">
                  <Link
                    href={`/playground?model=${encodeURIComponent(model.id)}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 dark:bg-emerald-400 dark:hover:bg-emerald-300 transition-all shadow-xs"
                  >
                    <span>Test in Playground</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
