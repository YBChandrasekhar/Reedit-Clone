import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const communities = await prisma.community.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-6 border border-[#edeff1] mb-4">
        <h1 className="text-2xl font-bold text-[#ff4500] mb-2">Welcome to Reddit Clone</h1>
        <p className="text-[#878a8c] text-sm mb-4">
          A community platform — share, vote, and discuss.
        </p>
        <div className="flex gap-3">
          <Link
            href="/communities/create"
            className="bg-[#ff4500] text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#e03d00] transition"
          >
            Create Community
          </Link>
          <Link
            href="/communities"
            className="border border-[#ff4500] text-[#ff4500] rounded-full px-4 py-2 text-sm font-semibold hover:bg-orange-50 transition"
          >
            Browse Communities
          </Link>
        </div>
      </div>

      {communities.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-[#edeff1]">
          <h2 className="font-semibold mb-3">Top Communities</h2>
          <div className="flex flex-col gap-2">
            {communities.map((c) => (
              <Link
                key={c.id}
                href={`/r/${c.slug}`}
                className="flex justify-between items-center py-2 border-b border-[#edeff1] last:border-0 hover:text-[#ff4500] transition"
              >
                <span className="text-sm font-medium">r/{c.name}</span>
                <span className="text-xs text-[#878a8c]">{c._count.posts} posts</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
