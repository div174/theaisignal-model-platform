"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { listModels } from "@/lib/data";
import { ChatInterface } from "@/components/chat-interface";
import { Sparkles, RefreshCw } from "lucide-react";

function PlaygroundContent() {
  const allModels = listModels();
  const searchParams = useSearchParams();
  const requestedModel = searchParams.get("model") || undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Model Sandbox</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
            AI Model Playground
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Send live prompts, inspect completion latency, evaluate reasoning depth, and verify token usage.
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <ChatInterface models={allModels} initialModelId={requestedModel} />
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-slate-400 dark:text-zinc-500">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
          <span>Loading AI Playground environment...</span>
        </div>
      }
    >
      <PlaygroundContent />
    </Suspense>
  );
}
