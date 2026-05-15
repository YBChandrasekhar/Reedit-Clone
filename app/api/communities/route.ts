import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, description } = await req.json();
  if (!name || name.length < 3) return NextResponse.json({ error: "Name must be at least 3 characters" }, { status: 400 });
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  try {
    const community = await prisma.community.create({ data: { name, slug, description } });
    return NextResponse.json(community, { status: 201 });
  } catch { return NextResponse.json({ error: "Community name already exists" }, { status: 409 }); }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort") || "latest";
  const communities = await prisma.community.findMany({
    orderBy: sort === "popular" ? { posts: { _count: "desc" } } : { createdAt: "desc" },
    include: { _count: { select: { posts: true } } },
  });
  return NextResponse.json(communities);
}
