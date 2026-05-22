import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/apiAuth";

export async function DELETE(_req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { postId } = await params;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  if (post.authorId !== user!.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.post.delete({ where: { id: postId } });
  return NextResponse.json({ message: "Post deleted" });
}
