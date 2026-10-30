export interface ChatCompletionMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface CallAIOptions {
  modelId: string;
  messages: ChatCompletionMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface AIProviderResponse {
  success: boolean;
  content?: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  durationMs: number;
  error?: string;
}

export async function callOpenRouterAI(options: CallAIOptions): Promise<AIProviderResponse> {
  const startTime = Date.now();
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return {
      success: false,
      durationMs: Date.now() - startTime,
      error:
        "OPENROUTER_API_KEY is not configured on the server. Please add your OpenRouter API key to your .env file (or Vercel environment variables) to enable live model responses. Get a key at https://openrouter.ai/keys",
    };
  }

  // Model ID mapping: If a hypothetical future benchmark model is chosen, we attempt it,
  // but if the provider rejects the hypothetical ID, we can offer helpful feedback.
  const requestedModel = options.modelId;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

  try {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const siteName = process.env.OPENROUTER_SITE_NAME || "OneAtlas AI Model Platform";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": siteUrl,
        "X-Title": siteName,
      },
      body: JSON.stringify({
        model: requestedModel,
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const durationMs = Date.now() - startTime;

    if (!response.ok) {
      let errorDetail = `Provider returned HTTP ${response.status} (${response.statusText})`;
      try {
        const errorJson = await response.json();
        if (errorJson?.error?.message) {
          errorDetail = errorJson.error.message;
        } else if (typeof errorJson?.error === "string") {
          errorDetail = errorJson.error;
        }
      } catch {
        // use status text fallback
      }

      // Check if it's a model not found error for mock benchmark models
      if (
        response.status === 404 ||
        errorDetail.toLowerCase().includes("not found") ||
        errorDetail.toLowerCase().includes("does not exist")
      ) {
        return {
          success: false,
          durationMs,
          error: `Model "${requestedModel}" was not found on OpenRouter. If you are testing the synthetic benchmark models from the assessment specification (e.g. GPT-6.1 Terra), try selecting verified live models like "anthropic/claude-3-5-sonnet" or "meta-llama/llama-3.3-70b-instruct". Original error: ${errorDetail}`,
        };
      }

      return {
        success: false,
        durationMs,
        error: errorDetail,
      };
    }

    const data = await response.json();
    const messageContent = data.choices?.[0]?.message?.content || "";
    const inputTokens = data.usage?.prompt_tokens ?? undefined;
    const outputTokens = data.usage?.completion_tokens ?? undefined;
    const totalTokens = data.usage?.total_tokens ?? (inputTokens && outputTokens ? inputTokens + outputTokens : undefined);

    return {
      success: true,
      content: messageContent,
      inputTokens,
      outputTokens,
      totalTokens,
      durationMs,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const durationMs = Date.now() - startTime;

    if (err instanceof Error) {
      if (err.name === "AbortError") {
        return {
          success: false,
          durationMs,
          error: "Request timed out after 45 seconds while waiting for the model provider.",
        };
      }
      return {
        success: false,
        durationMs,
        error: `Network or integration failure: ${err.message}`,
      };
    }

    return {
      success: false,
      durationMs,
      error: "An unexpected error occurred while communicating with the AI provider.",
    };
  }
}
