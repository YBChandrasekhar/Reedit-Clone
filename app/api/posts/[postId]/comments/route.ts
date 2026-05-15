import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { postId } = await params;
  const { content } = await req.json();
  if (!content || content.trim().length === 0) return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  const comment = await prisma.comment.create({
    data: { content: content.trim(), postId, authorId: user.id },
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
