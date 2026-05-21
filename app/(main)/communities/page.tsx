import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { CommunitySkeleton } from "@/components/Skeletons";
import EmptyState from "@/components/EmptyState";

export default async function CommunitiesPage({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const { sort = "latest" } = await searchParams;
  const communities = await prisma.community.findMany({
    orderBy: sort === "popular" ? { posts: { _count: "desc" } } : { createdAt: "desc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All Communities</h1>
        <Link href="/communities/create" className="bg-[#ff4500] text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#e03d00] transition">+ Create</Link>
      </div>
      <div className="bg-white rounded-lg border border-[#edeff1] p-2 flex gap-2 mb-4">
        <Link href="/communities?sort=latest" className={`px-4 py-2 rounded-full text-sm font-semibold transition ${sort === "latest" ? "bg-[#e8f0fe] text-[#0079d3]" : "text-[#878a8c] hover:bg-[#f6f7f8]"}`}>🕐 Latest</Link>
        <Link href="/communities?sort=popular" className={`px-4 py-2 rounded-full text-sm font-semibold transition ${sort === "popular" ? "bg-[#fff4f0] text-[#ff4500]" : "text-[#878a8c] hover:bg-[#f6f7f8]"}`}>🔥 Popular</Link>
      </div>
      {communities.length === 0 ? (
        <EmptyState
          icon="🏘️"
          title="No communities yet"
          description="Be the first to create one!"
          actionLabel="Create Community"
          actionHref="/communities/create"
        />
      ) : (
        <Suspense fallback={<div className="flex flex-col gap-3">{[...Array(4)].map((_, i) => <CommunitySkeleton key={i} />)}</div>}>
          <div className="flex flex-col gap-3">
            {communities.map((community: typeof communities[0]) => (
              <Link key={community.id} href={`/r/${community.slug}`} className="bg-white rounded-lg p-4 border border-[#edeff1] hover:border-[#878a8c] transition flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ff4500] flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {community.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[#ff4500]">r/{community.name}</p>
                    {community.description && <p className="text-sm text-[#878a8c] mt-1">{community.description}</p>}
                  </div>
                </div>
                <span className="text-sm text-[#878a8c] shrink-0 ml-4">{community._count.posts} posts</span>
              </Link>
            ))}
          </div>
        </Suspense>
      )}
    </div>
  );
}
