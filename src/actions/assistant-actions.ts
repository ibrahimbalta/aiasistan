"use server";

import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function createAssistant(formData: {
  name: string;
  description?: string;
  personality?: string;
}) {
  try {
    const user = await syncUser();
    if (!user) throw new Error("Unauthorized");

    const assistant = await prisma.assistant.create({
      data: {
        userId: user.id,
        name: formData.name,
        description: formData.description,
        personality: formData.personality,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, assistant };
  } catch (error: any) {
    console.error("Create Assistant Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateAssistant(id: string, data: {
  name: string;
  description?: string;
  personality?: string;
}) {
  try {
    const user = await syncUser();
    if (!user) throw new Error("Unauthorized");

    const assistant = await prisma.assistant.update({
      where: { id, userId: user.id },
      data: {
        name: data.name,
        description: data.description,
        personality: data.personality,
      },
    });

    revalidatePath(`/dashboard/${id}`);
    return { success: true, assistant };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPublicAssistant(id: string) {
  try {
    const assistant = await prisma.assistant.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });

    if (!assistant) throw new Error("Asistan bulunamadı");
    return { success: true, assistant };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAssistant(id: string) {
  try {
    const user = await syncUser();
    if (!user) throw new Error("Unauthorized");

    await prisma.assistant.delete({
      where: { id, userId: user.id },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAssistant(id: string) {
  try {
    const user = await syncUser();
    if (!user) throw new Error("Unauthorized");

    const assistant = await prisma.assistant.findUnique({
      where: { id, userId: user.id },
      include: {
        knowledge: true,
      },
    });

    return { success: true, assistant };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
