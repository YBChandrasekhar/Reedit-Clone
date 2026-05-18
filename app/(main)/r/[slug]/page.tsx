import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import PostCard from "@/components/PostCard";
import SortBar from "@/components/SortBar";
import JoinButton from "@/components/JoinButton";
import EmptyState from "@/components/EmptyState";
import { Suspense } from "react";
import { PostSkeleton } from "@/components/Skeletons";

export default async function CommunityPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { slug } = await params;
  const { sort = "latest" } = await searchParams;
  const { userId } = await auth();

  const community = await prisma.community.findUnique({
    where: { slug },
    include: {
      posts: {
        orderBy: sort === "popular" ? { votes: { _count: "desc" } } : { createdAt: "desc" },
        include: {
          author: true,
          community: true,
          votes: true,
          _count: { select: { comments: true, votes: true } },
        },
      },
      _count: { select: { members: true } },
    },
  });

  if (!community) return notFound();

  let currentUserId: string | null = null;
  let isMember = false;

  if (userId) {
    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (dbUser) {
      currentUserId = dbUser.id;
      const membership = await prisma.member.findUnique({
        where: { userId_communityId: { userId: dbUser.id, communityId: community.id } },
      });
      isMember = !!membership;
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Community Header */}
      <div className="bg-white rounded-lg border border-[#edeff1] mb-4 overflow-hidden">
        <div className="h-16 bg-[#ff4500]" />
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 -mt-10">
              <div className="w-16 h-16 rounded-full bg-[#ff4500] border-4 border-white flex items-center justify-center text-white text-2xl font-bold shrink-0">
                {community.name[0].toUpperCase()}
              </div>
              <div className="mt-6">
                <h1 className="text-xl font-bold">r/{community.name}</h1>
                {community.description && (
                  <p className="text-[#878a8c] text-sm mt-1">{community.description}</p>
                )}
              </div>
            </div>
            <div className="mt-2 shrink-0">
              <JoinButton
                slug={slug}
                initialJoined={isMember}
                initialCount={community._count.members}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#edeff1]">
            <span className="text-sm text-[#878a8c]">{community.posts.length} posts</span>
            <Link
              href={`/r/${slug}/create`}
              className="bg-[#ff4500] text-white rounded-full px-4 py-1 text-sm font-semibold hover:bg-[#e03d00] transition"
            >
              + Create Post
            </Link>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <SortBar />
      </Suspense>

      {community.posts.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No posts yet"
          description="Be the first to post in this community!"
          actionLabel="Create Post"
          actionHref={`/r/${slug}/create`}
        />
      ) : (
        <Suspense
          fallback={
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            {community.posts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={currentUserId} />
            ))}
          </div>
        </Suspense>
      )}
    </div>
  );
}
