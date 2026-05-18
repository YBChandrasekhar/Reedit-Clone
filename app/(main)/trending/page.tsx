import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import PostCard from "@/components/PostCard";
import { PostSkeleton } from "@/components/Skeletons";
import EmptyState from "@/components/EmptyState";
import { Suspense } from "react";

export default async function TrendingPage() {
  const { userId } = await auth();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const posts = await prisma.post.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    orderBy: { votes: { _count: "desc" } },
    take: 20,
    include: {
      author: true,
      community: true,
      votes: true,
      _count: { select: { comments: true, votes: true } },
    },
  });

  let currentUserId: string | null = null;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    currentUserId = user?.id ?? null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-6 border border-[#edeff1] mb-4">
        <h1 className="text-2xl font-bold">🔥 Trending</h1>
        <p className="text-[#878a8c] text-sm mt-1">
          Most popular posts from the last 7 days
        </p>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No trending posts yet"
          description="Be the first to post and get votes!"
          actionLabel="Browse Communities"
          actionHref="/communities"
        />
      ) : (
        <Suspense
          fallback={
            <div className="flex flex-col gap-3">
              {[...Array(5)].map((_, i) => <PostSkeleton key={i} />)}
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            {posts.map((post, i) => (
              <div key={post.id} className="relative">
                {i < 3 && (
                  <span className="absolute -top-2 -left-2 z-10 bg-[#ff4500] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
                    {i + 1}
                  </span>
                )}
                <PostCard post={post} currentUserId={currentUserId} />
              </div>
            ))}
          </div>
        </Suspense>
      )}
    </div>
  );
}
