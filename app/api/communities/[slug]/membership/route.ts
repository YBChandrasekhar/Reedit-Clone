import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/apiAuth";

export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { slug } = await params;
  const community = await prisma.community.findUnique({ where: { slug } });
  if (!community) return NextResponse.json({ error: "Community not found" }, { status: 404 });

  const existing = await prisma.member.findUnique({
    where: { userId_communityId: { userId: user!.id, communityId: community.id } },
  });

  if (existing) {
    await prisma.member.delete({ where: { userId_communityId: { userId: user!.id, communityId: community.id } } });
    return NextResponse.json({ joined: false });
  }

  await prisma.member.create({ data: { userId: user!.id, communityId: community.id } });
  return NextResponse.json({ joined: true });
}
