"use client";

import React, { useState, Suspense, useTransition } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { listModels } from "@/lib/data";
import { AIModel } from "@/lib/types";
import { ModelSelector } from "@/components/model-selector";
import { ComparisonTable } from "@/components/comparison-table";
import { CostCalculator } from "@/components/cost-calculator";
import { Share2, Check, Scale, RefreshCw } from "lucide-react";

function parseModelIdsFromParams(modelsParam: string | null, allModels: AIModel[]): string[] {
  if (modelsParam) {
    const parsedIds = modelsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const validIds: string[] = [];
    for (const id of parsedIds) {
      if (validIds.length >= 4) break;
      const exists = allModels.some((m) => m.id.toLowerCase() === id.toLowerCase());
      if (exists && !validIds.includes(id)) {
        validIds.push(id);
      }
    }

    if (validIds.length > 0) return validIds;
  }
  return ["openai/gpt-6.1-terra", "deepseek/deepseek-v4.1-flash-uncensored"];
}

function CompareContent() {
  const allModels = listModels();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [shareCopied, setShareCopied] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    parseModelIdsFromParams(searchParams.get("models"), allModels)
  );

  // Sync selected models to URL query string without full page reload (replaceState)
  const syncUrl = (newIds: string[]) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (newIds.length > 0) {
        params.set("models", newIds.join(","));
      }
      const newQuery = params.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      window.history.replaceState(null, "", newUrl);
    });
  };

  const handleSelectModel = (modelId: string) => {
    if (selectedIds.length >= 4) return;
    if (selectedIds.some((id) => id.toLowerCase() === modelId.toLowerCase())) return;

    const updated = [...selectedIds, modelId];
    setSelectedIds(updated);
    syncUrl(updated);
  };

  const handleRemoveModel = (modelId: string) => {
    const updated = selectedIds.filter((id) => id.toLowerCase() !== modelId.toLowerCase());
    setSelectedIds(updated);
    syncUrl(updated);
  };

  const handleShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const selectedModels: AIModel[] = selectedIds
    .map((id) => allModels.find((m) => m.id.toLowerCase() === id.toLowerCase()))
    .filter((m): m is AIModel => m !== undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Share Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>Side-by-Side Model Benchmarks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
            AI Model Comparison & Specs
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Evaluate architecture, context limits, multimodal capabilities, and price-to-performance tradeoffs across 2 to 4 models simultaneously.
          </p>
        </div>

        {/* Share Link Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareLink}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer"
            title="Share this comparison URL"
          >
            {shareCopied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Share2 className="w-4 h-4 text-slate-400 dark:text-zinc-400" />
            )}
            <span>{shareCopied ? "Link Copied!" : "Share Comparison"}</span>
          </button>
        </div>
      </div>

      {/* 1. Multi-Model Selector (Up to 4 models) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Selected Models ({selectedModels.length}/4)
          </span>
          {selectedModels.length < 2 && (
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Select at least 2 models
            </span>
          )}
        </div>

        <ModelSelector
          allModels={allModels}
          selectedModelIds={selectedIds}
          onSelectModel={handleSelectModel}
          onRemoveModel={handleRemoveModel}
          maxModels={4}
        />
      </section>

      {/* 2. Interactive Real-Time Cost Estimator */}
      {selectedModels.length > 0 && (
        <section>
          <CostCalculator models={selectedModels} />
        </section>
      )}

      {/* 3. Comparison Matrix Grid */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">
          Technical Specifications & Pricing Matrix
        </h2>
        <ComparisonTable
          models={selectedModels}
          onRemoveModel={handleRemoveModel}
        />
      </section>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-slate-400 dark:text-zinc-500">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
          <span>Loading comparison tools...</span>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
