"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { listModels, formatContext, formatCurrency } from "@/lib/data";
import { AIModel } from "@/lib/types";
import { ModelCard } from "@/components/model-card";
import { BrandLogo } from "@/components/brand-logo";
import {
  Search,
  Grid,
  List,
  Scale,
  Sparkles,
  ArrowRight,
  Brain,
  Wrench,
  Eye,
  FileCode2,
  Lock,
  Unlock,
  Info,
  X,
  Copy,
  Check,
  Server,
  Zap,
} from "lucide-react";

function ModelsDiscoveryContent() {
  const router = useRouter();
  const allModels = listModels();

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLab, setSelectedLab] = useState<string>("all");
  const [selectedCapability, setSelectedCapability] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "context-desc" | "intelligence-desc">("context-desc");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Selected models for compare tray
  const [comparedModelIds, setComparedModelIds] = useState<string[]>([
    "openai/gpt-6.1-terra",
    "deepseek/deepseek-v4.1-flash-uncensored",
  ]);

  // Model Detail Modal State
  const [selectedDetailModel, setSelectedDetailModel] = useState<AIModel | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Unique Labs for filter dropdown
  const labs = useMemo(() => {
    const set = new Set(allModels.map((m) => m.lab));
    return Array.from(set);
  }, [allModels]);

  const handleToggleCompare = (modelId: string) => {
    if (comparedModelIds.includes(modelId)) {
      setComparedModelIds((prev) => prev.filter((id) => id !== modelId));
    } else {
      if (comparedModelIds.length >= 4) {
        alert("You can compare up to 4 models at once. Remove one to add another.");
        return;
      }
      setComparedModelIds((prev) => [...prev, modelId]);
    }
  };

  const navigateToCompare = () => {
    if (comparedModelIds.length >= 2) {
      router.push(`/compare?models=${comparedModelIds.join(",")}`);
    }
  };

  const handleCopyModelId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Filtered & Sorted models
  const filteredModels = useMemo(() => {
    return allModels
      .filter((model) => {
        const q = searchQuery.toLowerCase().trim();
        if (q) {
          const matchName = model.name.toLowerCase().includes(q);
          const matchId = model.id.toLowerCase().includes(q);
          const matchLab = model.labName.toLowerCase().includes(q);
          const matchDesc = model.description.toLowerCase().includes(q);
          const matchProvider = model.providers.some((p) => p.toLowerCase().includes(q));
          if (!matchName && !matchId && !matchLab && !matchDesc && !matchProvider) {
            return false;
          }
        }

        if (selectedLab !== "all" && model.lab !== selectedLab) {
          return false;
        }

        if (selectedCapability === "reasoning" && !model.capabilities.reasoning) return false;
        if (selectedCapability === "toolCalling" && !model.capabilities.toolCalling) return false;
        if (selectedCapability === "vision" && !model.capabilities.vision) return false;
        if (selectedCapability === "structuredOutput" && !model.capabilities.structuredOutput) return false;
        if (selectedCapability === "openWeights" && !model.openWeights) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "price-asc") return a.cost.input - b.cost.input;
        if (sortBy === "context-desc") return b.context - a.context;
        if (sortBy === "intelligence-desc") return (b.intelligence ?? 0) - (a.intelligence ?? 0);
        return 0;
      });
  }, [allModels, searchQuery, selectedLab, selectedCapability, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Model Catalog & Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 mt-1">
            Discover & Explore AI Models
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-xl">
            Browse state-of-the-art models, inspect multimodal token economics, view technical specifications, and directly deploy into comparison or playground.
          </p>
        </div>

        {/* View Switcher & Compare Bar */}
        <div className="flex items-center gap-3">
          {/* Compare Drawer Pill */}
          {comparedModelIds.length > 0 && (
            <button
              type="button"
              onClick={navigateToCompare}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 dark:bg-emerald-400 dark:hover:bg-emerald-300 shadow-xs cursor-pointer transition-all"
            >
              <Scale className="w-4 h-4" />
              <span>Compare Selected ({comparedModelIds.length})</span>
            </button>
          )}

          {/* Cards / Table toggle */}
          <div className="inline-flex items-center p-1 rounded-xl border border-slate-200 bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-white text-slate-900 dark:bg-zinc-800 dark:text-zinc-100 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:text-zinc-400"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === "cards"
                  ? "bg-white text-slate-900 dark:bg-zinc-800 dark:text-zinc-100 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:text-zinc-400"
              }`}
              title="Cards View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by model name, provider, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 shadow-xs"
          />
        </div>

        {/* Lab Filter */}
        <div className="md:col-span-3">
          <select
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-xs cursor-pointer capitalize"
          >
            <option value="all">All AI Labs</option>
            {labs.map((lab) => (
              <option key={lab} value={lab}>
                {lab.charAt(0).toUpperCase() + lab.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Capability Filter */}
        <div className="md:col-span-2">
          <select
            value={selectedCapability}
            onChange={(e) => setSelectedCapability(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-xs cursor-pointer"
          >
            <option value="all">All Capabilities</option>
            <option value="reasoning">Reasoning</option>
            <option value="toolCalling">Tool Calling</option>
            <option value="vision">Vision</option>
            <option value="structuredOutput">Structured JSON</option>
            <option value="openWeights">Open Weights</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="md:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "price-asc" | "context-desc" | "intelligence-desc")}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-xs cursor-pointer"
          >
            <option value="context-desc">Sort: Max Context</option>
            <option value="price-asc">Sort: Lowest Price</option>
            <option value="intelligence-desc">Sort: Top Intelligence</option>
            <option value="name">Sort: Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Models View */}
      {filteredModels.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20">
          <Sparkles className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
            No AI models matched your filters
          </h3>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
            Try adjusting your search terms or clearing the selected capability.
          </p>
        </div>
      ) : viewMode === "cards" ? (
        /* Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isCompared={comparedModelIds.includes(model.id)}
              onToggleCompare={handleToggleCompare}
              onViewDetails={setSelectedDetailModel}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/40 text-slate-400 dark:text-zinc-500 uppercase font-mono font-bold tracking-wider">
                  <th className="p-3.5 pl-5">Model</th>
                  <th className="p-3.5">Context</th>
                  <th className="p-3.5">Price / 1M (In / Out)</th>
                  <th className="p-3.5">Capabilities</th>
                  <th className="p-3.5">Intelligence</th>
                  <th className="p-3.5">Weights</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {filteredModels.map((model) => {
                  const isCompared = comparedModelIds.includes(model.id);
                  return (
                    <tr
                      key={model.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-zinc-900/30 transition-colors"
                    >
                      {/* Model & Lab */}
                      <td className="p-3.5 pl-5">
                        <div className="flex items-center gap-2.5">
                          <BrandLogo lab={model.lab} size="sm" />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => setSelectedDetailModel(model)}
                                className="font-bold text-slate-900 dark:text-zinc-100 hover:text-emerald-500 hover:underline cursor-pointer text-left"
                              >
                                {model.name}
                              </button>
                              {model.isNew && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase">
                                  NEW
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                              {model.labName} • {model.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Context */}
                      <td className="p-3.5 font-mono font-semibold text-slate-800 dark:text-zinc-200">
                        {formatContext(model.context)}
                      </td>

                      {/* Pricing */}
                      <td className="p-3.5 font-mono">
                        <span className="text-slate-800 dark:text-zinc-200 font-semibold">
                          {formatCurrency(model.cost.input)}
                        </span>
                        <span className="text-slate-400 dark:text-zinc-500"> / </span>
                        <span className="text-slate-800 dark:text-zinc-200 font-semibold">
                          {formatCurrency(model.cost.output)}
                        </span>
                      </td>

                      {/* Capabilities */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1">
                          {model.capabilities.reasoning && (
                            <span className="p-1 rounded bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300" title="Reasoning">
                              <Brain className="w-3 h-3 text-emerald-500" />
                            </span>
                          )}
                          {model.capabilities.toolCalling && (
                            <span className="p-1 rounded bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300" title="Tool Calling">
                              <Wrench className="w-3 h-3 text-blue-500" />
                            </span>
                          )}
                          {model.capabilities.vision && (
                            <span className="p-1 rounded bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300" title="Vision">
                              <Eye className="w-3 h-3 text-purple-500" />
                            </span>
                          )}
                          {model.capabilities.structuredOutput && (
                            <span className="p-1 rounded bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300" title="Structured Output">
                              <FileCode2 className="w-3 h-3 text-amber-500" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Benchmark Score */}
                      <td className="p-3.5 font-mono">
                        {model.intelligence ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 dark:text-zinc-200">
                              {model.intelligence}
                            </span>
                            <div className="w-12 bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: `${Math.min(100, (model.intelligence / 70) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-zinc-600">N/A</span>
                        )}
                      </td>

                      {/* Open vs Closed */}
                      <td className="p-3.5">
                        {model.openWeights ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                            <Unlock className="w-3 h-3" />
                            Open
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
                            <Lock className="w-3 h-3" />
                            Closed
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedDetailModel(model)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                            title="View Full Specs"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleCompare(model.id)}
                            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                              isCompared
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : "border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            }`}
                            title={isCompared ? "Remove from comparison" : "Add to comparison"}
                          >
                            <Scale className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            href={`/playground?model=${encodeURIComponent(model.id)}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 dark:bg-emerald-400 dark:hover:bg-emerald-300 transition-colors shadow-xs"
                          >
                            <span>Test</span>
                            <ArrowRight className="w-3 h-3" />
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
      )}

      {/* Model Details Modal */}
      {selectedDetailModel && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-2xl flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <BrandLogo lab={selectedDetailModel.lab} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                      {selectedDetailModel.name}
                    </h3>
                    {selectedDetailModel.isNew && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase">
                        NEW
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
                    {selectedDetailModel.labName} • Released: {selectedDetailModel.releaseDate || "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyModelId(selectedDetailModel.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                >
                  {copiedId ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId ? "Copied" : "Copy ID"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDetailModel(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              {/* Description */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-1">
                  Architecture & Description
                </span>
                <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed bg-slate-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
                  {selectedDetailModel.description}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/30">
                  <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-zinc-500 block">
                    Context Window
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-900 dark:text-zinc-100">
                    {formatContext(selectedDetailModel.context)} tokens
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/30">
                  <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-zinc-500 block">
                    Max Output Limit
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-900 dark:text-zinc-100">
                    {selectedDetailModel.outputTokensLimit
                      ? `${formatContext(selectedDetailModel.outputTokensLimit)} tokens`
                      : "Standard"}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/30">
                  <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-zinc-500 block">
                    Input Price / 1M
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-900 dark:text-zinc-100">
                    {formatCurrency(selectedDetailModel.cost.input)}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/30">
                  <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-zinc-500 block">
                    Output Price / 1M
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-900 dark:text-zinc-100">
                    {formatCurrency(selectedDetailModel.cost.output)}
                  </span>
                </div>
              </div>

              {/* Benchmarks */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-2">
                  Performance Benchmarks
                </span>
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/30">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 dark:text-zinc-400">Intelligence</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-zinc-100">
                        {selectedDetailModel.intelligence ?? "N/A"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, ((selectedDetailModel.intelligence ?? 0) / 70) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 dark:text-zinc-400">Coding</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-zinc-100">
                        {selectedDetailModel.coding ?? "N/A"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, ((selectedDetailModel.coding ?? 0) / 70) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 dark:text-zinc-400">Agentic</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-zinc-100">
                        {selectedDetailModel.agentic ?? "N/A"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, ((selectedDetailModel.agentic ?? 0) / 70) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Providers */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-1.5">
                  Active Hosting Providers
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedDetailModel.providers.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 text-slate-700 dark:bg-zinc-900 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 capitalize"
                    >
                      <Server className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                      <span>{p}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  handleToggleCompare(selectedDetailModel.id);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  comparedModelIds.includes(selectedDetailModel.id)
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>
                  {comparedModelIds.includes(selectedDetailModel.id)
                    ? "In Comparison"
                    : "Add to Comparison"}
                </span>
              </button>

              <Link
                href={`/playground?model=${encodeURIComponent(selectedDetailModel.id)}`}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 dark:bg-emerald-400 dark:hover:bg-emerald-300 shadow-xs transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span>Try in Playground</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ModelsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Loading catalog...</div>}>
      <ModelsDiscoveryContent />
    </Suspense>
  );
}
