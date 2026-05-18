import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return { user: null, error: NextResponse.json({ error: "User not found. Please sign in again." }, { status: 404 }) };
  }
  return { user, error: null };
}
