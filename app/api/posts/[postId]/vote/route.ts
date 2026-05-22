import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/apiAuth";

export async function POST(req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { postId } = await params;
  const { type } = await req.json();
  if (type !== "UP" && type !== "DOWN") return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const existingVote = await prisma.vote.findUnique({ where: { userId_postId: { userId: user!.id, postId } } });
  if (existingVote) {
    if (existingVote.type === type) {
      await prisma.vote.delete({ where: { userId_postId: { userId: user!.id, postId } } });
      return NextResponse.json({ message: "Vote removed" });
    }
    const updated = await prisma.vote.update({ where: { userId_postId: { userId: user!.id, postId } }, data: { type } });
    return NextResponse.json(updated);
  }

  const vote = await prisma.vote.create({ data: { type, userId: user!.id, postId } });
  return NextResponse.json(vote, { status: 201 });
}
