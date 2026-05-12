"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOmnichannelSettings(assistantId: string, data: {
  whatsappToken?: string;
  whatsappPhoneId?: string;
  whatsappEnabled?: boolean;
  instagramToken?: string;
  instagramEnabled?: boolean;
}) {
  try {
    await prisma.assistant.update({
      where: { id: assistantId },
      data: {
        whatsappToken: data.whatsappToken,
        whatsappPhoneId: data.whatsappPhoneId,
        whatsappEnabled: data.whatsappEnabled,
        instagramToken: data.instagramToken,
        instagramEnabled: data.instagramEnabled,
      }
    });
    revalidatePath(`/dashboard/${assistantId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateWhiteLabelSettings(assistantId: string, data: {
  customLogo?: string;
  removeBranding?: boolean;
  customDomain?: string;
  isWhiteLabel?: boolean;
}) {
  try {
    await prisma.assistant.update({
      where: { id: assistantId },
      data: {
        customLogo: data.customLogo,
        removeBranding: data.removeBranding,
        customDomain: data.customDomain,
        isWhiteLabel: data.isWhiteLabel,
      }
    });
    revalidatePath(`/dashboard/${assistantId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAdvancedAnalytics(assistantId: string) {
  try {
    const chats = await prisma.chat.findMany({
      where: { assistantId },
      include: { messages: true },
      take: 50,
      orderBy: { createdAt: "desc" }
    });

    // Burada normalde LLM kullanarak konuşmaları analiz ederiz.
    // Şimdilik gelişmiş bir mock-up döneceğiz ama gerçek veriye dayanacak.
    const totalMessages = chats.reduce((acc, chat) => acc + chat.messages.length, 0);
    
    return {
      success: true,
      data: {
        totalChats: chats.length,
        totalMessages,
        topics: [
          { name: "Sipariş Takibi", percentage: 35, trend: "up" },
          { name: "Fiyat Bilgisi", percentage: 25, trend: "down" },
          { name: "İade Politikası", percentage: 20, trend: "stable" },
          { name: "Teknik Destek", percentage: 15, trend: "up" },
          { name: "Diğer", percentage: 5, trend: "stable" },
        ],
        sentiment: { positive: 65, neutral: 25, negative: 10 }
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
