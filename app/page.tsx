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
  Zap,
} from "lucide-react";

export default function HomePage() {
  const allModels = listModels();

  // Search & filter chips state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLab, setSelectedLab] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState("all");
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
    { id: "live", label: "Live Inference" },
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

      // Provider
      if (selectedProvider !== "all" && !model.providers.includes(selectedProvider)) {
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
      if (activeChip === "live" && !model.isAvailableLive) return false;

      return true;
    });
  }, [allModels, searchQuery, selectedLab, selectedProvider, activeChip]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. HERO SECTION & STATS WIDGET */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2 pb-4">
        {/* Left Hero Content */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Updated Oct 27, 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-slate-900 dark:text-zinc-100 font-editorial leading-[1.12]">
            Every AI model,{" "}
            <span className="italic font-normal text-emerald-600 dark:text-emerald-400">
              compared.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-xl leading-relaxed">
            Specs, pricing, capabilities, and providers in one place. Sort any column, filter
            to what you need, and open a model for the full record.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/compare?models=${comparedIds.join(",")}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-zinc-100 dark:text-slate-950 dark:hover:bg-white shadow-sm transition-all"
            >
              <Scale className="w-4 h-4" />
              <span>Compare Models ({comparedIds.length})</span>
            </Link>

            <Link
              href="/models"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-white/[0.12] dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-white transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Benchmarks</span>
            </Link>

            <Link
              href="/playground"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
            >
              <span>Browse Playground</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Stats & Coverage Widget (OneAtlas Warm Sand Style) */}
        <div className="lg:col-span-5 rounded-3xl p-6 sm:p-7 shadow-xl bg-[#eae5dd] text-[#1c1917] border border-[#d8d2c7] dark:bg-[#eae5dd] dark:text-[#1c1917] dark:border-[#d8d2c7] space-y-6">
          {/* Top Numeric Counters */}
          <div className="grid grid-cols-4 gap-2 text-center pb-5 border-b border-[#d8d2c7]">
            <div>
              <span className="block text-2xl sm:text-3xl font-black tracking-tight font-editorial">
                1,123
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider opacity-70">
                Models
              </span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black tracking-tight font-editorial">
                78
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider opacity-70">
                Labs
              </span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black tracking-tight font-editorial">
                220
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider opacity-70">
                Providers
              </span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black tracking-tight font-editorial">
                8,289
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider opacity-70">
                API listings
              </span>
            </div>
          </div>

          {/* Sub-cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Releases Sub-Card */}
            <div className="p-4 rounded-2xl bg-[#dfd9ce] border border-[#d2cbbf]">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-semibold">Releases per month</span>
                <span className="font-mono text-[11px] opacity-75">608 in 12 mo</span>
              </div>
              <div className="flex items-end gap-1.5 h-16 pt-2">
                {[25, 40, 32, 48, 42, 36, 52, 46, 60, 55, 78, 92].map((height, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t transition-all ${
                      i === 11 ? "bg-[#18181b]" : "bg-[#a8a195]"
                    }`}
                    style={{ height: `${height}%` }}
                    title={`Month ${i + 1}: ${height} releases`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[9px] font-mono opacity-60 mt-2">
                <span>Nov 25</span>
                <span>Oct 26</span>
              </div>
            </div>

            {/* Capability Coverage Sub-Card */}
            <div className="p-4 rounded-2xl bg-[#dfd9ce] border border-[#d2cbbf] space-y-2 text-xs">
              <span className="font-semibold block mb-1">Capability coverage</span>
              <div>
                <div className="flex justify-between text-[10px] opacity-80 mb-0.5">
                  <span>Tool calling</span>
                  <span className="font-mono">66%</span>
                </div>
                <div className="w-full bg-[#cbc3b5] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#18181b] h-full rounded-full w-[66%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] opacity-80 mb-0.5">
                  <span>Reasoning</span>
                  <span className="font-mono">50%</span>
                </div>
                <div className="w-full bg-[#cbc3b5] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#18181b] h-full rounded-full w-[50%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] opacity-80 mb-0.5">
                  <span>Vision input</span>
                  <span className="font-mono">49%</span>
                </div>
                <div className="w-full bg-[#cbc3b5] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#18181b] h-full rounded-full w-[49%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] opacity-80 mb-0.5">
                  <span>Open weights</span>
                  <span className="font-mono">44%</span>
                </div>
                <div className="w-full bg-[#cbc3b5] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#18181b] h-full rounded-full w-[44%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search 1,123 models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-white/[0.08] dark:bg-zinc-900/60 dark:text-zinc-100 shadow-2xs"
            />
          </div>

          {/* Dropdown Filters & Counter */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <select
              value={selectedLab}
              onChange={(e) => setSelectedLab(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-white/[0.08] dark:bg-zinc-900/60 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All labs</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="deepseek">DeepSeek</option>
              <option value="meta">Meta</option>
              <option value="google">Google</option>
              <option value="mistral">Mistral AI</option>
            </select>

            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-white/[0.08] dark:bg-zinc-900/60 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Any provider</option>
              <option value="openrouter">OpenRouter</option>
              <option value="azure">Azure</option>
              <option value="together">Together</option>
              <option value="groq">Groq</option>
              <option value="aws-bedrock">AWS Bedrock</option>
              <option value="gcp-vertex">GCP Vertex</option>
            </select>

            <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 pl-2">
              {filteredModels.length} models
            </span>

            {/* Link to catalog */}
            <Link
              href="/models"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline pl-2"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
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
                className={`px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 border-emerald-500 font-semibold shadow-xs"
                    : "border-slate-200 bg-white/70 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-white/[0.08] dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN TABLE LAYOUT (Direct OneAtlas Aesthetic) */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#080c14] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-zinc-900/40 text-slate-400 dark:text-zinc-500 uppercase font-mono font-bold tracking-wider">
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
                <th className="p-3">Released</th>
                <th className="p-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {filteredModels.map((model) => {
                const isCompared = comparedIds.includes(model.id);
                return (
                  <tr
                    key={model.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-zinc-900/30 transition-colors group"
                  >
                    {/* Model Info */}
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-2.5">
                        <BrandLogo lab={model.lab} size="sm" />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
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

                    {/* Providers Cluster Badge */}
                    <td className="p-3">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-zinc-900/60 font-mono text-[11px]">
                        <span className="font-bold text-slate-700 dark:text-zinc-300">
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
                        <Check className="w-3.5 h-3.5 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-slate-300 dark:text-zinc-700">—</span>
                      )}
                    </td>

                    {/* Tools */}
                    <td className="p-3 text-center">
                      {model.capabilities.toolCalling ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-slate-300 dark:text-zinc-700">—</span>
                      )}
                    </td>

                    {/* JSON */}
                    <td className="p-3 text-center">
                      {model.capabilities.structuredOutput ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 mx-auto" />
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

                    {/* Released */}
                    <td className="p-3 font-mono text-[10px] text-slate-400 dark:text-zinc-500 whitespace-nowrap">
                      {model.releaseDate || "—"}
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
                              : "border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-white/[0.08] dark:text-zinc-400 dark:hover:bg-zinc-800"
                          }`}
                          title={isCompared ? "In comparison" : "Add to comparison"}
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>

                        <Link
                          href={`/playground?model=${encodeURIComponent(model.id)}`}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 dark:bg-emerald-400 dark:hover:bg-emerald-300 transition-colors shadow-2xs"
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
