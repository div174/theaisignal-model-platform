export type Modality = "text" | "image" | "pdf" | "audio" | "video";

export interface ModelCost {
  input: number; // USD per 1M tokens
  output: number; // USD per 1M tokens
  cacheRead?: number | null;
  cacheWrite?: number | null;
}

export interface ModelCapabilities {
  reasoning: boolean;
  toolCalling: boolean;
  structuredOutput: boolean;
  vision: boolean;
  openWeights?: boolean;
}

export interface AIModel {
  id: string; // e.g., "openai/gpt-6.1-terra"
  name: string; // e.g., "GPT-6.1 Terra"
  lab: "openai" | "deepseek" | "anthropic" | "meta" | "google" | "mistral" | "qwen" | string;
  labName: string; // e.g., "OpenAI"
  description: string;
  context: number; // Context window in tokens, e.g., 1050000
  outputTokensLimit?: number; // Output token limit, e.g., 128000
  input: Modality[];
  output: Modality[];
  cost: ModelCost;
  lowestInput: number;
  intelligence?: number | null;
  coding?: number | null;
  agentic?: number | null;
  providers: string[]; // e.g., ["azure", "commandcode", "together", "openrouter"]
  releaseDate?: string;
  updatedDate?: string;
  isNew?: boolean;
  openWeights?: boolean;
  capabilities: ModelCapabilities;
  temperatureSupport?: boolean;
  isAvailableLive?: boolean; // Can be used directly with OpenRouter live completions
}

export interface CostCalculationResult {
  modelId: string;
  modelName: string;
  lab: string;
  inputCost: number;
  outputCost: number;
  totalMonthlyCost: number;
  isLowestBill: boolean;
  savingsVsNextBest: number | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  modelId?: string;
  modelName?: string;
  tokens?: {
    input?: number;
    output?: number;
    total?: number;
  };
  durationMs?: number;
}

export interface RequestHistoryItem {
  id: string;
  modelId: string;
  modelName: string | null;
  prompt: string;
  response: string;
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
  durationMs: number | null;
  createdAt: string;
}

export interface ChatApiResponse {
  success: boolean;
  response?: string;
  modelId?: string;
  modelName?: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  durationMs?: number;
  error?: string;
  historyId?: string;
  isSimulated?: boolean;
}

