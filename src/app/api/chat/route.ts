import { askAssistant } from "@/lib/rag";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { assistantId, question, sessionId } = await req.json();

    if (!assistantId || !question) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const answer = await askAssistant(assistantId, question, sessionId || "anonymous");

    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
