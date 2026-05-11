import { askAssistant } from "@/lib/rag";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Chat Request Body:", body);

    const { assistantId, question, sessionId } = body;

    if (!assistantId || !question) {
      console.error("Missing fields in /api/chat:", { assistantId, question });
      return NextResponse.json({ error: "Eksik bilgi: assistantId veya question bulunamadı." }, { status: 400 });
    }

    const answer = await askAssistant(assistantId, question, sessionId || "anonymous");

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Chat API Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
