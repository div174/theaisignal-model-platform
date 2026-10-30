"use client";

import React from "react";
import Link from "next/link";
import { AIModel } from "@/lib/types";
import { BrandLogo } from "./brand-logo";
import { formatContext, formatCurrency } from "@/lib/data";
import {
  ArrowRight,
  Scale,
  Brain,
  Wrench,
  Eye,
  FileCode2,
  Info,
} from "lucide-react";

interface ModelCardProps {
  model: AIModel;
  onToggleCompare?: (modelId: string) => void;
  onViewDetails?: (model: AIModel) => void;
  isCompared?: boolean;
}

export function ModelCard({
  model,
  onToggleCompare,
  onViewDetails,
  isCompared,
}: ModelCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-900">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <BrandLogo lab={model.lab} size="md" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => onViewDetails?.(model)}
                  className="font-bold text-slate-900 dark:text-zinc-100 text-sm group-hover:text-emerald-500 transition-colors text-left truncate cursor-pointer hover:underline"
                  title="View detailed specs"
                >
                  {model.name}
                </button>
                {model.isNew && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase">
                    NEW
                  </span>
                )}
                {model.openWeights && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    Open Weights
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono truncate block">
                {model.labName} • {model.id}
              </span>
            </div>
          </div>

          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(model)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors shrink-0"
              title="View full model details"
            >
              <Info className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
          {model.description}
        </p>

        {/* Specs Badges Grid */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-800/60 mb-4 text-xs font-mono">
          <div>
            <span className="text-[10px] uppercase text-slate-400 dark:text-zinc-500 block">
              Context
            </span>
            <span className="font-semibold text-slate-800 dark:text-zinc-200">
              {formatContext(model.context)}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 dark:text-zinc-500 block">
              In / Out (1M)
            </span>
            <span className="font-semibold text-slate-800 dark:text-zinc-200">
              {formatCurrency(model.cost.input)} / {formatCurrency(model.cost.output)}
            </span>
          </div>
        </div>

        {/* Capabilities Chips */}
        <div className="flex flex-wrap gap-1 mb-4">
          {model.capabilities.reasoning && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
              <Brain className="w-2.5 h-2.5 text-emerald-500" />
              Reasoning
            </span>
          )}
          {model.capabilities.toolCalling && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
              <Wrench className="w-2.5 h-2.5 text-blue-500" />
              Tools
            </span>
          )}
          {model.capabilities.vision && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
              <Eye className="w-2.5 h-2.5 text-purple-500" />
              Vision
            </span>
          )}
          {model.capabilities.structuredOutput && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
              <FileCode2 className="w-2.5 h-2.5 text-amber-500" />
              JSON
            </span>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
        {onToggleCompare && (
          <button
            type="button"
            onClick={() => onToggleCompare(model.id)}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              isCompared
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500/50 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isCompared ? "Compared" : "Compare"}</span>
          </button>
        )}

        <Link
          href={`/playground?model=${encodeURIComponent(model.id)}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 dark:bg-emerald-400 dark:hover:bg-emerald-300 transition-colors shadow-xs"
        >
          <span>Try Model</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
