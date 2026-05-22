import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/apiAuth";

export async function POST(req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { postId } = await params;
  const { content } = await req.json();
  if (!content || content.trim().length === 0) return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const comment = await prisma.comment.create({
    data: { content: content.trim(), postId, authorId: user!.id },
    include: { author: true },
  });
  return NextResponse.json(comment, { status: 201 });
}

export async function GET(_req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });
  return NextResponse.json(comments);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { postId } = await params;
  const { commentId } = await req.json();
  if (!commentId) return NextResponse.json({ error: "commentId is required" }, { status: 400 });

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  if (comment.postId !== postId) return NextResponse.json({ error: "Comment does not belong to this post" }, { status: 400 });
  if (comment.authorId !== user!.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.comment.delete({ where: { id: commentId } });
  return NextResponse.json({ message: "Comment deleted" });
}
