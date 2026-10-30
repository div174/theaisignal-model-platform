"use client";

import React, { useState, useRef, useEffect } from "react";
import { AIModel } from "@/lib/types";
import { BrandLogo } from "./brand-logo";
import { Search, Plus, X, Check, AlertCircle } from "lucide-react";

interface ModelSelectorProps {
  allModels: AIModel[];
  selectedModelIds: string[];
  onSelectModel: (modelId: string) => void;
  onRemoveModel: (modelId: string) => void;
  maxModels?: number;
}

export function ModelSelector({
  allModels,
  selectedModelIds,
  onSelectModel,
  onRemoveModel,
  maxModels = 4,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedModels = selectedModelIds
    .map((id) => allModels.find((m) => m.id.toLowerCase() === id.toLowerCase()))
    .filter((m): m is AIModel => m !== undefined);

  // Filter models for combobox dropdown
  const filteredModels = allModels.filter((model) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      model.name.toLowerCase().includes(q) ||
      model.id.toLowerCase().includes(q) ||
      model.lab.toLowerCase().includes(q) ||
      model.labName.toLowerCase().includes(q) ||
      model.providers.some((p) => p.toLowerCase().includes(q))
    );
  });

  const isAtMax = selectedModelIds.length >= maxModels;

  return (
    <div className="space-y-4">
      {/* Selected Models Chips & Add Button */}
      <div className="flex flex-wrap items-center gap-2.5">
        {selectedModels.map((model) => (
          <div
            key={model.id}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:border-slate-300 dark:hover:border-zinc-700"
          >
            <BrandLogo lab={model.lab} size="sm" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 leading-tight">
                {model.name}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono leading-none">
                {model.labName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onRemoveModel(model.id)}
              className="ml-1 p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title={`Remove ${model.name}`}
              aria-label={`Remove ${model.name}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Add Model Combobox Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            disabled={isAtMax}
            onClick={() => setIsOpen(!isOpen)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              isAtMax
                ? "border-slate-200 bg-slate-100 text-slate-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600 cursor-not-allowed opacity-70"
                : "border-dashed border-emerald-500/60 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/15"
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>
              {isAtMax
                ? `Max ${maxModels} models selected`
                : `Add model to compare (${selectedModelIds.length}/${maxModels})`}
            </span>
          </button>

          {/* Combobox Dropdown Menu */}
          {isOpen && !isAtMax && (
            <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 z-50 animate-in fade-in-0 zoom-in-95 duration-100">
              {/* Search Bar */}
              <div className="relative mb-2">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search by model, lab or provider..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                />
              </div>

              {/* Models List */}
              <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                {filteredModels.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 dark:text-zinc-500">
                    No matching AI models found
                  </div>
                ) : (
                  filteredModels.map((model) => {
                    const isAlreadySelected = selectedModelIds.some(
                      (id) => id.toLowerCase() === model.id.toLowerCase()
                    );

                    return (
                      <button
                        key={model.id}
                        type="button"
                        disabled={isAlreadySelected}
                        onClick={() => {
                          onSelectModel(model.id);
                          setIsOpen(false);
                          setSearchQuery("");
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          isAlreadySelected
                            ? "bg-slate-50 text-slate-400 dark:bg-zinc-900/50 dark:text-zinc-600 cursor-not-allowed"
                            : "hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-800 dark:text-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <BrandLogo lab={model.lab} size="sm" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold truncate">{model.name}</span>
                              {model.isNew && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase">
                                  NEW
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 dark:text-zinc-500 truncate block">
                              {model.labName} • ${model.cost.input}/1M in
                            </span>
                          </div>
                        </div>

                        {isAlreadySelected ? (
                          <Check className="w-4 h-4 text-slate-400 dark:text-zinc-600 shrink-0" />
                        ) : (
                          <Plus className="w-4 h-4 text-emerald-500 opacity-60 group-hover:opacity-100 shrink-0" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Helper notice if limit is reached */}
      {isAtMax && (
        <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-3 py-1.5 rounded-lg border border-amber-200/60 dark:border-amber-900/40">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Maximum of {maxModels} models can be compared concurrently. Remove one to add another.</span>
        </div>
      )}
    </div>
  );
}
