import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ posts: [], communities: [] });

  const [posts, communities] = await Promise.all([
    prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        community: true,
        votes: true,
        _count: { select: { comments: true, votes: true } },
      },
    }),
    prisma.community.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      include: { _count: { select: { posts: true } } },
    }),
  ]);

  return NextResponse.json({ posts, communities });
}
