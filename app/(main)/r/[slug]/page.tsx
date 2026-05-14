import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import PostCard from "@/components/PostCard";

export default async function CommunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { userId } = await auth();

  const community = await prisma.community.findUnique({
    where: { slug },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          community: true,
          votes: true,
          _count: { select: { comments: true, votes: true } },
        },
      },
    },
  });

  if (!community) return notFound();

  // Get current user db id
  let currentUserId: string | null = null;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    currentUserId = user?.id ?? null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Community Header */}
      <div className="bg-white rounded-lg p-6 border border-[#edeff1] mb-4">
        <h1 className="text-2xl font-bold text-[#ff4500]">r/{community.name}</h1>
        {community.description && (
          <p className="text-[#878a8c] mt-2 text-sm">{community.description}</p>
        )}
        <div className="flex items-center gap-4 mt-4">
          <span className="text-sm text-[#878a8c]">{community.posts.length} posts</span>
          <Link
            href={`/r/${slug}/create`}
            className="bg-[#ff4500] text-white rounded-full px-4 py-1 text-sm font-semibold hover:bg-[#e03d00] transition"
          >
            + Create Post
          </Link>
        </div>
      </div>

      {/* Posts List */}
      {community.posts.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center text-[#878a8c]">
          No posts yet. Be the first to post!
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {community.posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </div>
  );
}
