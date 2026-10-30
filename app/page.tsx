"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { listModels, formatContext, formatCurrency } from "@/lib/data";
import { BrandLogo } from "@/components/brand-logo";
import {
  Scale,
  Sparkles,
  ArrowRight,
  Search,
  Check,
  FileCode2,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

export default function HomePage() {
  const allModels = listModels();

  // Search & filter chips state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLab, setSelectedLab] = useState("all");
  const [activeChip, setActiveChip] = useState<string | null>(null);

  // Selected models for quick compare tray
  const [comparedIds, setComparedIds] = useState<string[]>([
    "openai/gpt-6.1-terra",
    "deepseek/deepseek-v4.1-flash-uncensored",
  ]);

  const filterChips = [
    { id: "reasoning", label: "Reasoning" },
    { id: "toolCalling", label: "Tool calling" },
    { id: "structuredOutput", label: "Structured output" },
    { id: "vision", label: "Vision" },
    { id: "openWeights", label: "Open weights" },
    { id: "1m-context", label: "1M+ context" },
    { id: "free", label: "Low Cost (<$1)" },
  ];

  const handleChipClick = (id: string) => {
    setActiveChip((prev) => (prev === id ? null : id));
  };

  const handleToggleCompare = (modelId: string) => {
    if (comparedIds.includes(modelId)) {
      setComparedIds((prev) => prev.filter((id) => id !== modelId));
    } else {
      if (comparedIds.length >= 4) {
        alert("You can compare up to 4 models at once. Remove one to add another.");
        return;
      }
      setComparedIds((prev) => [...prev, modelId]);
    }
  };

  const filteredModels = useMemo(() => {
    return allModels.filter((model) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matches =
          model.name.toLowerCase().includes(q) ||
          model.id.toLowerCase().includes(q) ||
          model.labName.toLowerCase().includes(q) ||
          model.providers.some((p) => p.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Lab
      if (selectedLab !== "all" && model.lab !== selectedLab) {
        return false;
      }

      // Chip
      if (activeChip === "reasoning" && !model.capabilities.reasoning) return false;
      if (activeChip === "toolCalling" && !model.capabilities.toolCalling) return false;
      if (activeChip === "structuredOutput" && !model.capabilities.structuredOutput) return false;
      if (activeChip === "vision" && !model.capabilities.vision) return false;
      if (activeChip === "openWeights" && !model.openWeights) return false;
      if (activeChip === "1m-context" && model.context < 1000000) return false;
      if (activeChip === "free" && model.cost.input > 1.0) return false;

      return true;
    });
  }, [allModels, searchQuery, selectedLab, activeChip]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Section with Stats Widgets matching OneAtlas UI reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 pb-2">
        {/* Left Hero Content */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 dark:text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Updated Oct 27, 2026 • Live Intelligence Index</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 font-serif leading-[1.1]">
            Every AI model, <br />
            <span className="italic font-normal text-emerald-600 dark:text-emerald-400">
              compared.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-xl leading-relaxed">
            Specs, token pricing, capabilities, and provider routing in one unified platform. Sort any column, filter to your workload, and launch models directly in the interactive playground.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/compare?models=${comparedIds.join(",")}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 dark:bg-emerald-400 dark:hover:bg-emerald-300 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Scale className="w-4 h-4" />
              <span>Compare Models ({comparedIds.length})</span>
            </Link>

            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Launch Playground</span>
            </Link>

            <Link
              href="/models"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Stats & Coverage Widget (As seen in Reference Image) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90 backdrop-blur-md space-y-6">
          {/* Top Numeric Counters */}
          <div className="grid grid-cols-4 gap-2 text-center pb-5 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <span className="block text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100 font-mono">
                1,123
              </span>
              <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-zinc-500">
                Models
              </span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100 font-mono">
                78
              </span>
              <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-zinc-500">
                Labs
              </span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100 font-mono">
                220
              </span>
              <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-zinc-500">
                Providers
              </span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100 font-mono">
                8,289
              </span>
              <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-zinc-500">
                Listings
              </span>
            </div>
          </div>

          {/* Releases per month & Capability Coverage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mini Bar Chart: Releases */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-800/60">
              <div className="flex items-center justify-between text-[11px] mb-3">
                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                  Releases per month
                </span>
                <span className="text-slate-400 dark:text-zinc-500 font-mono">608 in 12 mo</span>
              </div>
              <div className="flex items-end gap-1.5 h-16 pt-2">
                {[28, 42, 35, 50, 44, 38, 55, 48, 62, 58, 80, 95].map((height, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t transition-all ${
                      i === 11
                        ? "bg-emerald-500 dark:bg-emerald-400"
                        : "bg-slate-300 dark:bg-zinc-700/60"
                    }`}
                    style={{ height: `${height}%` }}
                    title={`Month ${i + 1}: ${height} models`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400 dark:text-zinc-500 mt-2">
                <span>Nov 25</span>
                <span>Oct 26</span>
              </div>
            </div>

            {/* Capability Coverage Progress Bars */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-800/60 space-y-2 text-[11px]">
              <span className="font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                Capability coverage
              </span>
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-400 mb-0.5">
                  <span>Tool calling</span>
                  <span className="font-mono">66%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-800 dark:bg-zinc-200 h-full rounded-full w-[66%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-400 mb-0.5">
                  <span>Reasoning</span>
                  <span className="font-mono">50%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-800 dark:bg-zinc-200 h-full rounded-full w-[50%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-400 mb-0.5">
                  <span>Vision input</span>
                  <span className="font-mono">49%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-800 dark:bg-zinc-200 h-full rounded-full w-[49%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-400 mb-0.5">
                  <span>Open weights</span>
                  <span className="font-mono">44%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-800 dark:bg-zinc-200 h-full rounded-full w-[44%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar (As seen in Reference Image) */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search 1,123 models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex items-center gap-2">
            <select
              value={selectedLab}
              onChange={(e) => setSelectedLab(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All labs</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="deepseek">DeepSeek</option>
              <option value="meta">Meta</option>
              <option value="google">Google</option>
              <option value="mistral">Mistral AI</option>
            </select>

            <span className="text-xs font-mono text-slate-400 dark:text-zinc-500 pl-2">
              {filteredModels.length} models
            </span>
          </div>
        </div>

        {/* Filter Chips Horizontal Pill Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {filterChips.map((chip) => {
            const isActive = activeChip === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleChipClick(chip.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 border-emerald-500 font-semibold"
                    : "border-slate-200 bg-slate-100/70 text-slate-600 hover:bg-slate-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table Layout matching Reference UI */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/40 text-slate-400 dark:text-zinc-500 uppercase font-mono font-bold tracking-wider">
                <th className="p-3 pl-4">Model</th>
                <th className="p-3">Providers</th>
                <th className="p-3">Context</th>
                <th className="p-3">Output</th>
                <th className="p-3">Modalities</th>
                <th className="p-3 text-center">Reasoning</th>
                <th className="p-3 text-center">Tools</th>
                <th className="p-3 text-center">JSON</th>
                <th className="p-3">Weights</th>
                <th className="p-3">Price / 1M</th>
                <th className="p-3">Cache</th>
                <th className="p-3">Intelligence</th>
                <th className="p-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
              {filteredModels.map((model) => {
                const isCompared = comparedIds.includes(model.id);
                return (
                  <tr
                    key={model.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-zinc-900/30 transition-colors"
                  >
                    {/* Model Info */}
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-2.5">
                        <BrandLogo lab={model.lab} size="sm" />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-zinc-100">
                              {model.name}
                            </span>
                            {model.isNew && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase">
                                NEW
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                            {model.labName} • {model.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Providers */}
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                          {model.providers.length}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 capitalize">
                          {model.providers[0]}
                        </span>
                      </div>
                    </td>

                    {/* Context */}
                    <td className="p-3 font-mono font-semibold text-slate-800 dark:text-zinc-200">
                      {formatContext(model.context)}
                    </td>

                    {/* Output */}
                    <td className="p-3 font-mono text-slate-600 dark:text-zinc-400">
                      {model.outputTokensLimit ? formatContext(model.outputTokensLimit) : "N/A"}
                    </td>

                    {/* Modalities */}
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {model.input.includes("text") && (
                          <span title="Text">
                            <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                          </span>
                        )}
                        {model.input.includes("image") && (
                          <span title="Image / Vision">
                            <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
                          </span>
                        )}
                        {model.input.includes("pdf") && (
                          <span title="PDF Document">
                            <FileCode2 className="w-3.5 h-3.5 text-blue-500" />
                          </span>
                        )}
                        <span className="text-slate-400 dark:text-zinc-600 text-[10px] px-0.5">→</span>
                        <span title="Text Output">
                          <FileText className="w-3.5 h-3.5 text-emerald-500" />
                        </span>
                      </div>
                    </td>

                    {/* Reasoning */}
                    <td className="p-3 text-center">
                      {model.capabilities.reasoning ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-slate-300 dark:text-zinc-700">—</span>
                      )}
                    </td>

                    {/* Tools */}
                    <td className="p-3 text-center">
                      {model.capabilities.toolCalling ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-slate-300 dark:text-zinc-700">—</span>
                      )}
                    </td>

                    {/* JSON */}
                    <td className="p-3 text-center">
                      {model.capabilities.structuredOutput ? (
                        <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-slate-300 dark:text-zinc-700">—</span>
                      )}
                    </td>

                    {/* Weights */}
                    <td className="p-3">
                      <span className="text-[11px] font-mono text-slate-600 dark:text-zinc-400">
                        {model.openWeights ? "Open" : "Closed"}
                      </span>
                    </td>

                    {/* Price / 1M */}
                    <td className="p-3 font-mono font-medium text-slate-800 dark:text-zinc-200 whitespace-nowrap">
                      {formatCurrency(model.cost.input)} / {formatCurrency(model.cost.output)}
                    </td>

                    {/* Cache */}
                    <td className="p-3 font-mono text-[11px] text-slate-500 dark:text-zinc-400">
                      {model.cost.cacheRead !== undefined && model.cost.cacheRead !== null
                        ? formatCurrency(model.cost.cacheRead)
                        : "—"}
                    </td>

                    {/* Intelligence Benchmark */}
                    <td className="p-3 font-mono">
                      {model.intelligence ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 dark:text-zinc-200">
                            {model.intelligence}
                          </span>
                          <div className="w-10 bg-slate-100 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${Math.min(100, (model.intelligence / 70) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-300 dark:text-zinc-700">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3 pr-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleCompare(model.id)}
                          className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                            isCompared
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                          }`}
                          title={isCompared ? "In comparison" : "Add to comparison"}
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>

                        <Link
                          href={`/playground?model=${encodeURIComponent(model.id)}`}
                          className="px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 dark:bg-emerald-400 dark:hover:bg-emerald-300 transition-colors shadow-xs"
                        >
                          Try
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
