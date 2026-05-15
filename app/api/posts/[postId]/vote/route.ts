import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { postId } = await params;
  const { type } = await req.json();
  if (type !== "UP" && type !== "DOWN") return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const existingVote = await prisma.vote.findUnique({ where: { userId_postId: { userId: user.id, postId } } });
  if (existingVote) {
    if (existingVote.type === type) {
      await prisma.vote.delete({ where: { userId_postId: { userId: user.id, postId } } });
      return NextResponse.json({ message: "Vote removed" });
    }
    const updated = await prisma.vote.update({ where: { userId_postId: { userId: user.id, postId } }, data: { type } });
    return NextResponse.json(updated);
  }
  const vote = await prisma.vote.create({ data: { type, userId: user.id, postId } });
  return NextResponse.json(vote, { status: 201 });
}
