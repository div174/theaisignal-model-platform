"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { RequestHistoryItem, AIModel } from "@/lib/types";
import { BrandLogo } from "./brand-logo";
import { formatTokens } from "@/lib/data";
import {
  Clock,
  Coins,
  Search,
  Trash2,
  X,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface HistoryListProps {
  models: AIModel[];
}

export function HistoryList({ models }: HistoryListProps) {
  const [history, setHistory] = useState<RequestHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<RequestHistoryItem | null>(null);
  const [filterModel, setFilterModel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterModel !== "all") params.append("model", filterModel);
      if (searchQuery.trim()) params.append("q", searchQuery.trim());

      const res = await fetch(`/api/history?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setHistory(data.history || []);
        setCurrentPage(1); // reset to first page on new query
      } else {
        setError(data.error || "Failed to load request history.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error connecting to server.");
    } finally {
      setIsLoading(false);
    }
  }, [filterModel, searchQuery]);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const params = new URLSearchParams();
        if (filterModel !== "all") params.append("model", filterModel);
        if (searchQuery.trim()) params.append("q", searchQuery.trim());

        const res = await fetch(`/api/history?${params.toString()}`);
        const data = await res.json();
        if (!ignore) {
          if (res.ok && data.success) {
            setHistory(data.history || []);
            setCurrentPage(1);
          } else {
            setError(data.error || "Failed to load request history.");
          }
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Error connecting to server.");
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [filterModel, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleDelete = async (id?: string) => {
    const confirmMsg = id
      ? "Are you sure you want to delete this history item?"
      : "Are you sure you want to clear all history records?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const url = id ? `/api/history?id=${id}` : "/api/history";
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        if (id) {
          setHistory((prev) => prev.filter((item) => item.id !== id));
          if (selectedRecord?.id === id) setSelectedRecord(null);
        } else {
          setHistory([]);
          setSelectedRecord(null);
        }
      }
    } catch {
      alert("Failed to delete record.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(history.length / itemsPerPage));
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return history.slice(start, start + itemsPerPage);
  }, [history, currentPage]);

  return (
    <div className="space-y-6">
      {/* Search and Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search prompts and responses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-20 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-2.5 py-1 text-xs rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          {/* Model Filter */}
          <select
            value={filterModel}
            onChange={(e) => setFilterModel(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">All Models</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchHistory}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          {/* Clear All History */}
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => handleDelete()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="p-12 text-center text-xs text-slate-400 dark:text-zinc-500">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
          <span>Loading usage logs from database...</span>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && history.length === 0 && (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/30">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-zinc-200">
            No request history recorded yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
            Prompt generations sent from the AI Playground will be saved to your database and displayed here.
          </p>
        </div>
      )}

      {/* History Items Grid / List */}
      {!isLoading && history.length > 0 && (
        <div className="space-y-3">
          {paginatedHistory.map((item) => {
            const labName = item.modelId.split("/")[0] || "ai";
            return (
              <div
                key={item.id}
                onClick={() => setSelectedRecord(item)}
                className="group p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <BrandLogo lab={labName} size="sm" />
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                      {item.modelName || item.modelId}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                      • {item.modelId}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.createdAt)}
                    </span>
                    {item.totalTokens ? (
                      <span className="flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        {formatTokens(item.totalTokens)} tokens
                      </span>
                    ) : item.durationMs ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {(item.durationMs / 1000).toFixed(2)}s
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-500"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Prompt Preview */}
                <div className="text-xs text-slate-900 dark:text-zinc-100 font-medium line-clamp-1 mb-1">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold mr-1.5">
                    Prompt:
                  </span>
                  {item.prompt}
                </div>

                {/* Response Preview */}
                <div className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
                  <span className="text-slate-400 dark:text-zinc-500 font-semibold mr-1.5">
                    AI Response:
                  </span>
                  {item.response}
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-zinc-800">
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, history.length)} of {history.length} logged queries
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <span className="text-xs font-mono text-slate-600 dark:text-zinc-400 px-2">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal / Drawer for Inspection */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-2xl flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2.5">
                <BrandLogo lab={selectedRecord.modelId.split("/")[0]} size="sm" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                    {selectedRecord.modelName || selectedRecord.modelId}
                  </h4>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                    {formatDate(selectedRecord.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(selectedRecord.response)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? "Copied" : "Copy Response"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-1">
                  User Prompt
                </span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-xs font-mono text-slate-800 dark:text-zinc-200 whitespace-pre-wrap">
                  {selectedRecord.prompt}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block mb-1">
                  AI Generated Response
                </span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-xs text-slate-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
                  {selectedRecord.response}
                </div>
              </div>

              {/* Token & Performance Metrics */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-100/60 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/60 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Prompt Tokens</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">
                    {selectedRecord.inputTokens ? formatTokens(selectedRecord.inputTokens) : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Completion Tokens</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">
                    {selectedRecord.outputTokens ? formatTokens(selectedRecord.outputTokens) : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Total / Latency</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">
                    {selectedRecord.totalTokens ? `${formatTokens(selectedRecord.totalTokens)} tks` : "N/A"}
                    {selectedRecord.durationMs ? ` (${(selectedRecord.durationMs / 1000).toFixed(2)}s)` : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
