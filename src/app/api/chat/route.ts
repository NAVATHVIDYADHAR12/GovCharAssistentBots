import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getSystemPrompt } from "@/lib/prompts";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 60000, // 60 second timeout
  maxRetries: 3,
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured. Please add it to .env.local" },
        { status: 500 }
      );
    }

    const { messages, domainId, domainName, language } = await req.json();

    const systemPrompt = getSystemPrompt(
      domainId || "scholarship",
      domainName || "Scholarships",
      language || "English"
    );

    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: chatMessages,
      temperature: 0.3,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || "I could not generate a response. Please try again.";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Groq API error:", error);

    if (error instanceof Error) {
      if (error.message.includes("timed out") || error.message.includes("timeout")) {
        return NextResponse.json(
          { error: "Request timed out. The Groq API is slow or unreachable. Check your internet connection and try again." },
          { status: 504 }
        );
      }
      if (error.message.includes("401") || error.message.includes("authentication")) {
        return NextResponse.json(
          { error: "Invalid API key. Please check your GROQ_API_KEY in .env.local" },
          { status: 401 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
