import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import PostCard from "@/components/PostCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const { userId } = await auth();

  if (!q || q.trim().length < 2) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg p-12 text-center border border-[#edeff1]">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold text-lg">Enter at least 2 characters to search</p>
        </div>
      </div>
    );
  }

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
        // likes: true,
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

  let currentUserId: string | null = null;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    currentUserId = user?.id ?? null;
  }

  const total = posts.length + communities.length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-4 border border-[#edeff1] mb-4">
        <h1 className="font-bold text-lg">
          Search results for &quot;{q}&quot;
        </h1>
        <p className="text-sm text-[#878a8c]">{total} result{total !== 1 ? "s" : ""} found</p>
      </div>

      {total === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-[#edeff1]">
          <p className="text-4xl mb-3">😕</p>
          <p className="font-semibold text-lg mb-1">No results found</p>
          <p className="text-[#878a8c] text-sm">Try a different search term</p>
        </div>
      ) : (
        <>
          {communities.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-[#878a8c] uppercase tracking-wide mb-2 px-1">
                Communities
              </h2>
              <div className="flex flex-col gap-2">
                {communities.map((c) => (
                  <Link
                    key={c.id}
                    href={`/r/${c.slug}`}
                    className="bg-white rounded-lg p-4 border border-[#edeff1] hover:border-[#878a8c] transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#ff4500] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {c.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#ff4500]">r/{c.name}</p>
                        {c.description && (
                          <p className="text-xs text-[#878a8c]">{c.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-[#878a8c] shrink-0">{c._count.posts} posts</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {posts.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-[#878a8c] uppercase tracking-wide mb-2 px-1">
                Posts
              </h2>
              <div className="flex flex-col gap-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} currentUserId={currentUserId} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
