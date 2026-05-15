import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { CommunitySkeleton } from "@/components/Skeletons";

export default async function CommunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort = "latest" } = await searchParams;

  const communities = await prisma.community.findMany({
    orderBy: sort === "popular"
      ? { posts: { _count: "desc" } }
      : { createdAt: "desc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All Communities</h1>
        <Link
          href="/communities/create"
          className="bg-[#ff4500] text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#e03d00] transition"
        >
          + Create
        </Link>
      </div>

      {/* Sort Tabs */}
      <div className="bg-white rounded-lg border border-[#edeff1] p-2 flex gap-2 mb-4">
        <Link
          href="/communities?sort=latest"
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            sort === "latest" ? "bg-[#e8f0fe] text-[#0079d3]" : "text-[#878a8c] hover:bg-[#f6f7f8]"
          }`}
        >
          🕐 Latest
        </Link>
        <Link
          href="/communities?sort=popular"
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            sort === "popular" ? "bg-[#fff4f0] text-[#ff4500]" : "text-[#878a8c] hover:bg-[#f6f7f8]"
          }`}
        >
          🔥 Popular
        </Link>
      </div>

      {communities.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-[#edeff1]">
          <p className="text-4xl mb-3">🏘️</p>
          <p className="font-semibold text-lg mb-1">No communities yet</p>
          <p className="text-[#878a8c] text-sm mb-4">Be the first to create one!</p>
          <Link
            href="/communities/create"
            className="bg-[#ff4500] text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#e03d00] transition"
          >
            Create Community
          </Link>
        </div>
      ) : (
        <Suspense fallback={
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => <CommunitySkeleton key={i} />)}
          </div>
        }>
          <div className="flex flex-col gap-3">
            {communities.map((community) => (
              <Link
                key={community.id}
                href={`/r/${community.slug}`}
                className="bg-white rounded-lg p-4 border border-[#edeff1] hover:border-[#878a8c] transition flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-[#ff4500]">r/{community.name}</p>
                  {community.description && (
                    <p className="text-sm text-[#878a8c] mt-1">{community.description}</p>
                  )}
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
