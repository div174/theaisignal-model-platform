"use client";

import React, { useState, useRef, useEffect } from "react";
import { AIModel, ChatMessage } from "@/lib/types";
import { BrandLogo } from "./brand-logo";
import { formatCurrency, formatTokens } from "@/lib/data";
import {
  Send,
  Trash2,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  Coins,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

interface ChatInterfaceProps {
  models: AIModel[];
  initialModelId?: string;
}

export function ChatInterface({ models, initialModelId }: ChatInterfaceProps) {
  // Initialize selected model
  const [selectedModel, setSelectedModel] = useState<AIModel>(() => {
    if (initialModelId) {
      const found = models.find((m) => m.id.toLowerCase() === initialModelId.toLowerCase());
      if (found) return found;
    }
    return (
      models.find((m) => m.id === "anthropic/claude-3-5-sonnet") ||
      models[0]
    );
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([]);
    setErrorMessage(null);
  };

  const handleSelectSuggestedPrompt = (suggestedText: string) => {
    setPrompt(suggestedText);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || isLoading) return;

    setErrorMessage(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
      modelId: selectedModel.id,
      modelName: selectedModel.name,
    };

    const newConversation = [...messages, userMessage];
    setMessages(newConversation);
    setPrompt("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel.id,
          messages: newConversation.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "Failed to receive a response from the model.");
      } else {
        const assistantMessage: ChatMessage = {
          id: data.historyId || `assistant-${Date.now()}`,
          role: "assistant",
          content: data.response || "(Empty response)",
          timestamp: Date.now(),
          modelId: data.modelId || selectedModel.id,
          modelName: data.modelName || selectedModel.name,
          tokens: data.usage,
          durationMs: data.durationMs,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Network error occurred while contacting the server."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    "Explain the architectural differences between dense and Mixture-of-Experts (MoE) LLMs.",
    "Write a TypeScript utility for exponential backoff retry with jitter.",
    "Compare the cost efficiency of Llama 3.3 70B vs Claude 3.5 Sonnet for high-volume extraction.",
    "Draft a concise summary of the key challenges in agentic workflows with multi-turn tool calling.",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden transition-colors">
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/50">
        {/* Model Picker */}
        <div className="flex items-center gap-3">
          <BrandLogo lab={selectedModel.lab} size="md" />
          <div className="relative">
            <select
              value={selectedModel.id}
              onChange={(e) => {
                const found = models.find((m) => m.id === e.target.value);
                if (found) setSelectedModel(found);
              }}
              className="appearance-none font-semibold text-sm bg-transparent pr-7 pl-1 py-1 text-slate-900 dark:text-zinc-100 focus:outline-none cursor-pointer rounded-lg hover:bg-slate-200/50 dark:hover:bg-zinc-800/60"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id} className="dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">
                  {m.name} ({m.labName})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute right-1.5 top-2.5 pointer-events-none" />
          </div>
          <span className="hidden sm:inline-block text-xs font-mono text-slate-400 dark:text-zinc-500">
            • {selectedModel.id}
          </span>
        </div>

        {/* Clear Conversation & Model Specs info */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-400 dark:text-zinc-500 font-mono pr-2 border-r border-slate-200 dark:border-zinc-800">
            <span>In: {formatCurrency(selectedModel.cost.input)}/1M</span>
            <span>Out: {formatCurrency(selectedModel.cost.output)}/1M</span>
          </div>

          <button
            type="button"
            onClick={handleClear}
            disabled={messages.length === 0 && !errorMessage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-rose-400 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto text-center py-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100">
              AI Playground — {selectedModel.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-md">
              Send prompts to test responses, evaluate output formatting, measure inference speed, and track token consumption.
            </p>

            {/* Starter Prompts */}
            <div className="w-full mt-6 space-y-2 text-left">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Suggested starter prompts
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestedPrompt(p)}
                    className="p-3 text-left text-xs rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 transition-all cursor-pointer"
                  >
                    &quot;{p}&quot;
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Chat History */
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.role === "user" ? "ml-auto justify-end" : "mr-auto justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <Bot className="w-4 h-4" />
                  </div>
                </div>
              )}

              <div
                className={`flex flex-col group relative rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white rounded-br-xs dark:bg-emerald-600 shadow-xs"
                    : "bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 rounded-bl-xs"
                }`}
              >
                {/* Assistant Model Name and Info */}
                {msg.role === "assistant" && (
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-slate-200/60 dark:border-zinc-800/80 text-[11px] text-slate-400 dark:text-zinc-500">
                    <span className="font-semibold text-slate-700 dark:text-zinc-300">
                      {msg.modelName || selectedModel.name}
                    </span>
                    <div className="flex items-center gap-3 font-mono text-[10px]">
                      {msg.durationMs && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {(msg.durationMs / 1000).toFixed(2)}s
                        </span>
                      )}
                      {msg.tokens?.total && (
                        <span className="flex items-center gap-1">
                          <Coins className="w-3 h-3" />
                          {formatTokens(msg.tokens.total)} tokens
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                        title="Copy response"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Message Content */}
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
              </div>

              {msg.role === "user" && (
                <div className="shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-zinc-200 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-xl mr-auto justify-start animate-in fade-in-0 duration-200">
            <div className="shrink-0 mt-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
              </div>
            </div>
            <div className="rounded-2xl rounded-bl-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Generating response with {selectedModel.name}...</span>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300 text-xs flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div className="space-y-1">
              <span className="font-semibold block">Inference Request Failed</span>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Area */}
      <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
        <div className="relative rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all shadow-xs">
          <textarea
            ref={textareaRef}
            rows={3}
            placeholder={`Ask ${selectedModel.name} anything... (Enter to send, Shift+Enter for newline)`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="w-full p-3.5 text-sm bg-transparent text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 resize-none focus:outline-none"
          />

          <div className="flex items-center justify-between px-3.5 pb-3 pt-1">
            <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
              {prompt.length} chars
            </span>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!prompt.trim() || isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 dark:bg-emerald-400 dark:hover:bg-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
