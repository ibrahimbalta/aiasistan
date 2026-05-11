import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(
  req: NextRequest,
  { params }: { params: { assistantId: string } }
) {
  try {
    const { assistantId } = params;
    const body = await req.json();
    const message = body.message;

    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text;

    // 1. Veritabanından bu asistanı ve token'ını bulalım
    const assistant = await prisma.assistant.findUnique({
      where: { id: assistantId },
      include: { knowledge: true }
    });

    if (!assistant || !assistant.telegramEnabled || !assistant.telegramToken) {
      return NextResponse.json({ ok: true });
    }

    // 2. RAG: Bilgi havuzunu bağlama
    const knowledgeContext = assistant.knowledge
      .map(k => k.content)
      .join("\n\n")
      .substring(0, 5000);

    // 3. AI Yanıtı
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: `Sen ${assistant.name} isimli bir asistanın Telegram botusun. Kişiliğin: ${assistant.personality || 'Profesyonel'}. Bilgiler: ${knowledgeContext}` },
        { role: "user", content: text },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const aiResponse = completion.choices[0]?.message?.content || "Cevap üretilemedi.";

    // 4. Telegram'a Yanıtı Gönder (Kendi Token'ı ile)
    await fetch(`https://api.telegram.org/bot${assistant.telegramToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: aiResponse,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("SaaS Telegram Error:", error);
    return NextResponse.json({ ok: true });
  }
}
