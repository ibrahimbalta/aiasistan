import { createClient } from "@/utils/supabase/server";
import { prisma } from "./prisma";

export async function syncUser() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  if (!authUser) return null;

  const user = await prisma.user.upsert({
    where: { supabaseId: authUser.id },
    update: {
      email: authUser.email!,
      name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
    },
    create: {
      supabaseId: authUser.id,
      email: authUser.email!,
      name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
    },
  });

  return user;
}

export async function getDbUser() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  if (!authUser) return null;

  return await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
  });
}
