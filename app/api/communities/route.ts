import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/apiAuth";

export async function POST(req: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const { name, description } = await req.json();
  if (!name || name.trim().length < 3) return NextResponse.json({ error: "Name must be at least 3 characters" }, { status: 400 });

  const slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  try {
    const community = await prisma.community.create({ data: { name: name.trim(), slug, description: description?.trim() || null } });
    return NextResponse.json(community, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Community name already exists" }, { status: 409 });
  }
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
