import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function syncUser() {
  const { userId } = auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      email: clerkUser.emailAddresses[0].emailAddress,
      name: `${clerkUser.firstName} ${clerkUser.lastName}`,
    },
    create: {
      clerkId: userId,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: `${clerkUser.firstName} ${clerkUser.lastName}`,
    },
  });

  return user;
}

export async function getDbUser() {
  const { userId } = auth();
  if (!userId) return null;

  return await prisma.user.findUnique({
    where: { clerkId: userId },
  });
}
