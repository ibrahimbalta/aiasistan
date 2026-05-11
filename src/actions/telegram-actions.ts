"use server";

import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

const APP_URL = "https://aiasistan-eight.vercel.app";

export async function updateTelegramSettings(assistantId: string, token: string, enabled: boolean) {
  try {
    const user = await syncUser();
    if (!user) throw new Error("Unauthorized");

    // 1. Webhook'u Telegram tarafında ayarla
    if (enabled && token) {
      const webhookUrl = `${APP_URL}/api/webhooks/telegram/${assistantId}`;
      const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`);
      const data = await res.json();
      
      if (!data.ok) {
        throw new Error(`Telegram Hatası: ${data.description}`);
      }
    }

    // 2. Veritabanını güncelle
    await prisma.assistant.update({
      where: { id: assistantId, userId: user.id },
      data: {
        telegramToken: token,
        telegramEnabled: enabled
      }
    });

    revalidatePath(`/dashboard/${assistantId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
