import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import ProfileTabs from "@/components/ProfileTabs";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { userId } = await auth();

  const profileUser = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          community: true,
          votes: true,
          // likes: true,
          _count: { select: { comments: true, votes: true } },
        },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          post: {
            include: { community: true },
          },
        },
      },
    },
  });

  if (!profileUser) return notFound();

  let currentUserId: string | null = null;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    currentUserId = user?.id ?? null;
  }

  const isOwnProfile = currentUserId === profileUser.id;

  return (
    <div className="max-w-5xl mx-auto flex gap-6">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <ProfileTabs
          posts={profileUser.posts}
          comments={profileUser.comments}
          currentUserId={currentUserId}
        />
      </div>

      {/* Sidebar */}
      <div className="w-72 shrink-0 hidden md:block">
        <div className="bg-white rounded-lg border border-[#edeff1] overflow-hidden">
          {/* Banner */}
          <div className="h-16 bg-[#ff4500]" />

          {/* Avatar */}
          <div className="px-4 pb-4">
            <div className="w-16 h-16 rounded-full bg-[#edeff1] border-4 border-white -mt-8 flex items-center justify-center text-2xl">
              👤
            </div>
            <h1 className="font-bold text-lg mt-2">u/{profileUser.username}</h1>
            {isOwnProfile && (
              <p className="text-xs text-[#878a8c] mt-1">This is you!</p>
            )}
            <div className="border-t border-[#edeff1] mt-4 pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#878a8c]">Posts</span>
                <span className="font-semibold">{profileUser.posts.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#878a8c]">Comments</span>
                <span className="font-semibold">{profileUser.comments.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#878a8c]">Joined</span>
                <span className="font-semibold">
                  {new Date(profileUser.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
