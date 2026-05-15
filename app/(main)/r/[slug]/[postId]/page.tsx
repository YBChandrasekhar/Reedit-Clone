import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import VoteButton from "@/components/VoteButton";
import CommentSection from "@/components/CommentSection";
import { auth } from "@clerk/nextjs/server";

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string; postId: string }> }) {
  const { slug, postId } = await params;
  const { userId } = await auth();

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { author: true, community: true, comments: { orderBy: { createdAt: "desc" }, include: { author: true } }, votes: true },
  });

  if (!post) return notFound();

  const voteCount = post.votes.filter((v) => v.type === "UP").length - post.votes.filter((v) => v.type === "DOWN").length;

  let userVote: "UP" | "DOWN" | null = null;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (user) userVote = (post.votes.find((v) => v.userId === user.id)?.type as "UP" | "DOWN") ?? null;
  }

  const comments = post.comments.map((c) => ({ id: c.id, content: c.content, createdAt: c.createdAt.toISOString(), author: { username: c.author.username } }));

  return (
    <div className="max-w-2xl mx-auto">
      <Link href={`/r/${slug}`} className="text-sm text-[#878a8c] hover:text-black mb-4 inline-block">← Back to r/{slug}</Link>
      <div className="bg-white rounded-lg border border-[#edeff1] p-6 mb-4">
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <VoteButton postId={post.id} initialVotes={voteCount} initialUserVote={userVote} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-[#878a8c] mb-2">r/{post.community.name} • Posted by u/{post.author.username}</p>
            <h1 className="text-xl font-bold mb-3">{post.title}</h1>
            {post.type === "text" && post.content && <p className="text-sm text-[#1c1c1c] leading-relaxed">{post.content}</p>}
            {post.type === "image" && post.imageUrl && <Image src={post.imageUrl} alt={post.title} width={600} height={400} className="rounded-lg w-full object-cover" />}
            {post.type === "link" && post.content && <a href={post.content} target="_blank" rel="noopener noreferrer" className="text-[#0079d3] text-sm hover:underline break-all">{post.content}</a>}
            <div className="flex gap-4 mt-4 text-xs text-[#878a8c]">
              <span>{comments.length} comments</span>
            </div>
          </div>
        </div>
      </div>
      <CommentSection postId={post.id} initialComments={comments} />
    </div>
  );
}
