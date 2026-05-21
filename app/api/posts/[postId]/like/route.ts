import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/apiAuth";

export async function POST(_req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { postId } = await params;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId: user!.id, postId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { userId_postId: { userId: user!.id, postId } } });
    return NextResponse.json({ liked: false });
  }

  await prisma.like.create({ data: { userId: user!.id, postId } });
  return NextResponse.json({ liked: true });
}
