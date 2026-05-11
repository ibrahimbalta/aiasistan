"use server";

import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function addKnowledge(assistantId: string, type: "TXT" | "LINK", content: string, fileName: string) {
  try {
    const user = await syncUser();
    if (!user) throw new Error("Unauthorized");

    const knowledge = await prisma.knowledgeBase.create({
      data: {
        assistantId,
        type,
        content,
        fileName,
      }
    });

    revalidatePath(`/dashboard/${assistantId}`);
    return { success: true, knowledge };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteKnowledge(id: string, assistantId?: string) {
  try {
    const user = await syncUser();
    if (!user) throw new Error("Unauthorized");

    await prisma.knowledgeBase.delete({
      where: { id }
    });

    if (assistantId) {
      revalidatePath(`/dashboard/${assistantId}`);
    }
    revalidatePath("/dashboard/knowledge");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getKnowledgeBase() {
  try {
    const user = await syncUser();
    if (!user) throw new Error("Unauthorized");

    const knowledge = await prisma.knowledgeBase.findMany({
      where: {
        assistant: { userId: user.id }
      },
      include: {
        assistant: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return { success: true, knowledge };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
