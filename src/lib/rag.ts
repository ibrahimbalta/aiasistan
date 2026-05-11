import { getChatCompletion } from "./groq";
import { prisma } from "./prisma";

export async function askAssistant(assistantId: string, question: string, sessionId: string) {
  try {
    // 1. Get assistant details
    const assistant = await prisma.assistant.findUnique({
      where: { id: assistantId },
      include: { knowledge: true },
    });

    if (!assistant) throw new Error("Assistant not found");

    // 2. Search knowledge base (RAG)
    // For MVP, we'll fetch all knowledge content if small, or simulate vector search
    // In production, this would be: const context = await vectorSearch(question, assistantId);
    let context = "";
    if (assistant.knowledge.length > 0) {
      context = assistant.knowledge
        .map((k) => k.content)
        .filter(Boolean)
        .join("\n\n");
    }

    // 3. Build prompt
    const systemPrompt = `
      Sen ${assistant.name} adında bir yapay zeka asistanısın.
      Kişiliğin: ${assistant.personality || "Profesyonel ve yardımsever."}
      
      Sana verilen bilgileri (context) kullanarak soruları cevapla. 
      Eğer cevap verilen bilgilerde yoksa, dürüstçe bilmediğini söyle veya genel bilgi ver ama uydurma.
      
      BİLGİLER:
      ${context}
    `;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ];

    // 4. Get completion from Groq
    const answer = await getChatCompletion(messages);

    // 5. Save to chat history
    await prisma.chat.create({
      data: {
        assistantId,
        sessionId,
        messages: {
          create: [
            { role: "user", content: question },
            { role: "assistant", content: answer },
          ],
        },
      },
    });

    return answer;
  } catch (error) {
    console.error("RAG Error:", error);
    return "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.";
  }
}
