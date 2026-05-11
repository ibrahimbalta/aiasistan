"use server";

import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/embeddings";
import { chunkText } from "@/lib/utils-rag";
import { revalidatePath } from "next/cache";

export async function addKnowledge(assistantId: string, type: "TXT" | "PDF" | "LINK", content: string, fileName?: string) {
  try {
    // 1. Metni parçalara böl (Chunking)
    const chunks = chunkText(content);

    // 2. Her parça için embedding oluştur ve kaydet
    // Not: MVP'de şimdilik ilk 1-2 parçayı veya tümünü kaydedebiliriz.
    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk);
      
      await prisma.knowledgeBase.create({
        data: {
          assistantId,
          type,
          content: chunk,
          fileName: fileName || "isimsiz-kaynak",
          // Not: Prisma Unsupported field için raw query gerekebilir
          // Şimdilik sadece içeriği kaydediyoruz, vektör araması için pgvector query'si eklenecek.
        },
      });
    }

    revalidatePath(`/dashboard/${assistantId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Bilgi ekleme hatası:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteKnowledge(id: string, assistantId: string) {
  try {
    await prisma.knowledgeBase.delete({
      where: { id },
    });
    revalidatePath(`/dashboard/${assistantId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
