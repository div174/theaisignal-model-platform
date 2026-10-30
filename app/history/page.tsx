"use client";

import React from "react";
import { listModels } from "@/lib/data";
import { HistoryList } from "@/components/history-list";
import { Database } from "lucide-react";

export default function HistoryPage() {
  const models = listModels();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Persistent Request Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
            Usage History & Audit Log
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-xl">
            Review past generations, inspect prompt/response payloads, verify latency metrics, and audit token billing.
          </p>
        </div>
      </div>

      {/* History List Component */}
      <HistoryList models={models} />
    </div>
  );
}
