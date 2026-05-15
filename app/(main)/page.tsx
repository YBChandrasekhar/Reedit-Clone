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
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort = "latest" } = await searchParams;
  const { userId } = await auth();

  const posts = await prisma.post.findMany({
    orderBy: sort === "popular"
      ? { votes: { _count: "desc" } }
      : { createdAt: "desc" },
    take: 20,
    include: {
      author: true,
      community: true,
      votes: true,
      _count: { select: { comments: true, votes: true } },
    },
  });

  const communities = await prisma.community.findMany({
    orderBy: { posts: { _count: "desc" } },
    take: 5,
    include: { _count: { select: { posts: true } } },
  });

  let currentUserId: string | null = null;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    currentUserId = user?.id ?? null;
  }

  return (
    <div className="max-w-5xl mx-auto flex gap-6">
      {/* Main Feed */}
      <div className="flex-1 min-w-0">
        {/* Sort Bar */}
        <Suspense fallback={null}>
          <SortBar />
        </Suspense>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-[#edeff1]">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-semibold text-lg mb-1">No posts yet</p>
            <p className="text-[#878a8c] text-sm mb-4">Create a community and start posting!</p>
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
              {[...Array(5)].map((_, i) => <PostSkeleton key={i} />)}
            </div>
          }>
            <div className="flex flex-col gap-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} currentUserId={currentUserId} />
              ))}
            </div>
          </Suspense>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-72 shrink-0 hidden md:block">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg border border-[#edeff1] p-4 mb-4">
          <div className="bg-[#ff4500] rounded-t-lg -mx-4 -mt-4 px-4 py-8 mb-3" />
          <h2 className="font-bold mb-2">Home</h2>
          <p className="text-sm text-[#878a8c] mb-4">
            Your personal Reddit Clone front page. Come here to check in with your favorite communities.
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

        {/* Top Communities */}
        {communities.length > 0 && (
          <div className="bg-white rounded-lg border border-[#edeff1] p-4">
            <h2 className="font-bold mb-3">Top Communities</h2>
            <div className="flex flex-col gap-2">
              {communities.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/r/${c.slug}`}
                  className="flex items-center gap-2 py-1 hover:text-[#ff4500] transition"
                >
                  <span className="text-xs text-[#878a8c] w-4">{i + 1}</span>
                  <span className="text-sm font-medium flex-1">r/{c.name}</span>
                  <span className="text-xs text-[#878a8c]">{c._count.posts}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
