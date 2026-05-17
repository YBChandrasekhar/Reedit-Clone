import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import PostCard from "@/components/PostCard";
import SortBar from "@/components/SortBar";
import { Suspense } from "react";
import { PostSkeleton } from "@/components/Skeletons";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; page?: string }>;
}) {
  const { sort = "latest", page = "1" } = await searchParams;
  const { userId } = await auth();
  const pageNum = parseInt(page);
  const limit = 10;
  const skip = (pageNum - 1) * limit;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const where = sort === "trending" ? { createdAt: { gte: sevenDaysAgo } } : {};
  const orderBy =
    sort === "popular" || sort === "trending"
      ? { votes: { _count: "desc" as const } }
      : { createdAt: "desc" as const };

  const [posts, totalPosts, communities, totalUsers] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        author: true,
        community: true,
        votes: true,
        _count: { select: { comments: true, votes: true } },
      },
    }),
    prisma.post.count({ where }),
    prisma.community.findMany({
      orderBy: { posts: { _count: "desc" } },
      take: 5,
      include: { _count: { select: { posts: true } } },
    }),
    prisma.user.count(),
  ]);

  const totalPages = Math.ceil(totalPosts / limit);
  const hasMore = skip + posts.length < totalPosts;

  let currentUserId: string | null = null;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    currentUserId = user?.id ?? null;
  }

  return (
    <div className="max-w-5xl mx-auto flex gap-6">
      {/* Main Feed */}
      <div className="flex-1 min-w-0">
        <Suspense fallback={null}>
          <SortBar showTrending />
        </Suspense>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-[#edeff1]">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-semibold text-lg mb-1">No posts yet</p>
            <p className="text-[#878a8c] text-sm mb-4">
              {sort === "trending"
                ? "No trending posts in the last 7 days."
                : "Create a community and start posting!"}
            </p>
            <Link
              href="/communities/create"
              className="bg-[#ff4500] text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#e03d00] transition"
            >
              Create Community
            </Link>
          </div>
        ) : (
          <>
            <Suspense
              fallback={
                <div className="flex flex-col gap-3">
                  {[...Array(5)].map((_, i) => <PostSkeleton key={i} />)}
                </div>
              }
            >
              <div className="flex flex-col gap-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} currentUserId={currentUserId} />
                ))}
              </div>
            </Suspense>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {pageNum > 1 && (
                  <Link
                    href={`?sort=${sort}&page=${pageNum - 1}`}
                    className="px-4 py-2 bg-white border border-[#edeff1] rounded-full text-sm font-semibold hover:border-[#878a8c] transition"
                  >
                    ← Prev
                  </Link>
                )}
                <span className="text-sm text-[#878a8c]">
                  Page {pageNum} of {totalPages}
                </span>
                {hasMore && (
                  <Link
                    href={`?sort=${sort}&page=${pageNum + 1}`}
                    className="px-4 py-2 bg-white border border-[#edeff1] rounded-full text-sm font-semibold hover:border-[#878a8c] transition"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-72 shrink-0 hidden md:block">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg border border-[#edeff1] overflow-hidden mb-4">
          <div className="bg-[#ff4500] h-16" />
          <div className="p-4">
            <h2 className="font-bold mb-2">🏠 Home Feed</h2>
            <p className="text-sm text-[#878a8c] mb-4">
              Your personal Reddit Clone front page. Come here to check in with
              your favorite communities.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/communities/create"
                className="bg-[#ff4500] text-white rounded-full py-2 text-sm font-semibold hover:bg-[#e03d00] transition text-center"
              >
                Create Community
              </Link>
              <Link
                href="/communities"
                className="border border-[#ff4500] text-[#ff4500] rounded-full py-2 text-sm font-semibold hover:bg-orange-50 transition text-center"
              >
                Browse Communities
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg border border-[#edeff1] p-4 mb-4">
          <h2 className="font-bold mb-3">📊 Stats</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#878a8c]">Total Posts</span>
              <span className="font-semibold">{totalPosts}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#878a8c]">Communities</span>
              <span className="font-semibold">{communities.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#878a8c]">Members</span>
              <span className="font-semibold">{totalUsers}</span>
            </div>
          </div>
        </div>

        {/* Top Communities */}
        {communities.length > 0 && (
          <div className="bg-white rounded-lg border border-[#edeff1] p-4">
            <h2 className="font-bold mb-3">🔥 Top Communities</h2>
            <div className="flex flex-col gap-2">
              {communities.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/r/${c.slug}`}
                  className="flex items-center gap-2 py-1 hover:text-[#ff4500] transition"
                >
                  <span className="text-xs text-[#878a8c] w-4">{i + 1}</span>
                  <div className="w-6 h-6 rounded-full bg-[#ff4500] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {c.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium flex-1 truncate">
                    r/{c.name}
                  </span>
                  <span className="text-xs text-[#878a8c]">
                    {c._count.posts}
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href="/communities"
              className="block text-center text-xs text-[#0079d3] hover:underline mt-3"
            >
              View All Communities →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
