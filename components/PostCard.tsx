import Link from "next/link";
import VoteButton from "@/components/VoteButton";

type Props = {
  post: {
    id: string;
    title: string;
    content: string | null;
    type: string;
    createdAt: Date;
    author: { username: string };
    community: { slug: string; name: string };
    _count: { comments: number; votes: number };
    votes: { type: string; userId: string }[];
  };
  currentUserId?: string | null;
};

export default function PostCard({ post, currentUserId }: Props) {
  const upvotes = post.votes.filter((v) => v.type === "UP").length;
  const downvotes = post.votes.filter((v) => v.type === "DOWN").length;
  const voteCount = upvotes - downvotes;
  const userVote = currentUserId
    ? (post.votes.find((v) => v.userId === currentUserId)?.type as "UP" | "DOWN") ?? null
    : null;

  return (
    <div className="bg-white rounded-lg border border-[#edeff1] hover:border-[#878a8c] transition flex">
      {/* Vote Column */}
      <div className="flex flex-col items-center p-3 bg-[#f8f9fa] rounded-l-lg">
        <VoteButton postId={post.id} initialVotes={voteCount} initialUserVote={userVote} />
      </div>

      {/* Post Content */}
      <Link href={`/r/${post.community.slug}/${post.id}`} className="flex-1 p-4 block">
        <p className="text-xs text-[#878a8c] mb-1">
          r/{post.community.name} • u/{post.author.username}
        </p>
        <h2 className="font-semibold text-base">{post.title}</h2>
        {post.type === "text" && post.content && (
          <p className="text-sm text-[#878a8c] mt-1 line-clamp-2">{post.content}</p>
        )}
        {post.type === "link" && post.content && (
          <p className="text-xs text-[#0079d3] mt-1 truncate">{post.content}</p>
        )}
        {post.type === "image" && (
          <p className="text-xs text-[#878a8c] mt-1">📷 Image post</p>
        )}
        <div className="flex gap-4 mt-3 text-xs text-[#878a8c]">
          <span>{post._count.comments} comments</span>
        </div>
      </Link>
    </div>
  );
}
