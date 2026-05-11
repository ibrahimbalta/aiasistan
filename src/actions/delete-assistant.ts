"use server";

import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function deleteAssistant(id: string) {
  try {
    const user = await syncUser();
    if (!user) throw new Error("Unauthorized");

    // Asistanın bu kullanıcıya ait olduğunu doğrula ve sil
    await prisma.assistant.delete({
      where: { 
        id,
        userId: user.id
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/assistants");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
