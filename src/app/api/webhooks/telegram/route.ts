import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text;

    // 1. Botun hangi asistana bağlı olduğunu bulalım
    // Not: Gerçek senaryoda her asistanın kendi bot tokenı olur. 
    // Şimdilik demo için ilk aktif asistanı seçiyoruz veya mesajla ID eşliyoruz.
    const assistant = await prisma.assistant.findFirst({
      include: { knowledge: true }
    });

    if (!assistant) return NextResponse.json({ ok: true });

    // 2. Basit bir RAG mantığıyla bilgi havuzunu tara
    const knowledgeContext = assistant.knowledge
      .map(k => k.content)
      .join("\n\n")
      .substring(0, 4000);

    // 3. AI Cevabını Hazırla
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: `Sen bir Telegram asistanısın. Kişiliğin: ${assistant.personality || 'Yardımsever bir asistan'}. Aşağıdaki bilgiler dahilinde cevap ver: ${knowledgeContext}` },
        { role: "user", content: text },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const aiResponse = completion.choices[0]?.message?.content || "Üzgünüm, şu an cevap veremiyorum.";

    // 4. Telegram'a Cevap Gönder
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (botToken) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: aiResponse,
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram Webhook Error:", error);
    return NextResponse.json({ ok: true }); // Telegram'ın tekrar denememesi için 200 dönüyoruz
  }
}
