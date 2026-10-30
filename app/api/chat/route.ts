import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { callOpenRouterAI, ChatCompletionMessage } from "@/lib/ai-provider";
import { getModel } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { model, messages, temperature } = body;

    // 1. Validate incoming payload structure
    if (!model || typeof model !== "string" || !model.trim()) {
      return NextResponse.json(
        { success: false, error: "Validation Error: 'model' field is required." },
        { status: 400 }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "Validation Error: 'messages' must be a non-empty array." },
        { status: 400 }
      );
    }

    // 2. Validate message structure and prompt contents
    const formattedMessages: ChatCompletionMessage[] = [];
    for (const msg of messages) {
      if (!msg || typeof msg !== "object") {
        return NextResponse.json(
          { success: false, error: "Validation Error: Each message must be an object." },
          { status: 400 }
        );
      }

      if (!msg.role || !["user", "assistant", "system"].includes(msg.role)) {
        return NextResponse.json(
          { success: false, error: "Validation Error: Invalid message role. Must be 'user', 'assistant', or 'system'." },
          { status: 400 }
        );
      }

      if (typeof msg.content !== "string") {
        return NextResponse.json(
          { success: false, error: "Validation Error: Message content must be a string." },
          { status: 400 }
        );
      }

      formattedMessages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    // Find the latest user message to check for empty prompt
    const latestUserMsg = [...formattedMessages].reverse().find((m) => m.role === "user");
    if (!latestUserMsg || !latestUserMsg.content.trim()) {
      return NextResponse.json(
        { success: false, error: "Validation Error: User prompt cannot be empty." },
        { status: 400 }
      );
    }

    // Look up model metadata for human-readable name
    const modelMeta = getModel(model);
    const modelName = modelMeta?.name || model;

    // 3. Call OpenRouter AI provider
    const aiResult = await callOpenRouterAI({
      modelId: model,
      messages: formattedMessages,
      temperature: typeof temperature === "number" ? temperature : 0.7,
    });

    if (!aiResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: aiResult.error || "Failed to generate AI response from provider.",
          durationMs: aiResult.durationMs,
        },
        { status: 502 }
      );
    }

    const aiContent = aiResult.content || "";

    // 4. Save successful request and response to database
    let historyRecord = null;
    try {
      historyRecord = await db.requestHistory.create({
        data: {
          modelId: model,
          modelName: modelName,
          prompt: latestUserMsg.content,
          response: aiContent,
          inputTokens: aiResult.inputTokens ?? null,
          outputTokens: aiResult.outputTokens ?? null,
          totalTokens: aiResult.totalTokens ?? null,
          durationMs: aiResult.durationMs,
        },
      });
    } catch (dbErr) {
      console.error("Database save warning:", dbErr);
      // We still return the AI response even if saving to DB fails
    }

    return NextResponse.json({
      success: true,
      response: aiContent,
      modelId: model,
      modelName,
      usage: {
        inputTokens: aiResult.inputTokens,
        outputTokens: aiResult.outputTokens,
        totalTokens: aiResult.totalTokens,
      },
      durationMs: aiResult.durationMs,
      historyId: historyRecord?.id,
    });
  } catch (err: unknown) {
    console.error("Unhandled API error in /api/chat:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}
