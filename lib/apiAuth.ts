import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    // Auto-create user if webhook missed
    const { currentUser } = await import("@clerk/nextjs/server");
    const clerkUser = await currentUser();
    if (!clerkUser) return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
    const username = clerkUser.username ?? email.split("@")[0];
    user = await prisma.user.create({
      data: { clerkId: userId, email, username, imageUrl: clerkUser.imageUrl },
    });
  }
  return { user, error: null };
}
