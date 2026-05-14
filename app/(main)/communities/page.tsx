import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CommunitiesPage() {
  const communities = await prisma.community.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Communities</h1>
        <Link href="/communities/create" className="bg-[#ff4500] text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#e03d00] transition">
          + Create Community
        </Link>
      </div>

      {communities.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center text-[#878a8c]">
          No communities yet. Be the first to create one!
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {communities.map((community) => (
            <Link key={community.id} href={`/r/${community.slug}`} className="bg-white rounded-lg p-4 border border-[#edeff1] hover:border-[#878a8c] transition flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#ff4500]">r/{community.name}</p>
                {community.description && (
                  <p className="text-sm text-[#878a8c] mt-1">{community.description}</p>
                )}
              </div>
              <span className="text-sm text-[#878a8c]">{community._count.posts} posts</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
