import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content, imageUrl, type, communityId } = await req.json();
  if (!title || !communityId)
    return NextResponse.json({ error: "Title and community are required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const post = await prisma.post.create({
    data: { title, content: content || null, imageUrl: imageUrl || null, type: type || "text", communityId, authorId: user.id },
  });

  return NextResponse.json(post, { status: 201 });
}
