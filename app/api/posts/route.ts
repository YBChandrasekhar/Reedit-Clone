import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/apiAuth";

export async function POST(req: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { title, content, imageUrl, type, communityId } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!communityId) return NextResponse.json({ error: "Community is required" }, { status: 400 });

  const community = await prisma.community.findUnique({ where: { id: communityId } });
  if (!community) return NextResponse.json({ error: "Community not found" }, { status: 404 });

  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      content: content?.trim() || null,
      imageUrl: imageUrl || null,
      type: type || "text",
      communityId,
      authorId: user!.id,
    },
  });
  return NextResponse.json(post, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort") || "latest";
  const communityId = searchParams.get("communityId");
  const where = communityId ? { communityId } : {};
  const posts = await prisma.post.findMany({
    where,
    orderBy: sort === "popular" ? { votes: { _count: "desc" } } : { createdAt: "desc" },
    include: { author: true, community: true, votes: true, _count: { select: { comments: true, votes: true } } },
  });
  return NextResponse.json(posts);
}
