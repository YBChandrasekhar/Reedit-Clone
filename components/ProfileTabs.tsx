"use client";

import { useState } from "react";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";

type Post = {
  id: string;
  title: string;
  content: string | null;
  imageUrl: string | null;
  type: string;
  createdAt: Date;
  authorId: string;
  author: { username: string };
  community: { slug: string; name: string };
  votes: { type: string; userId: string }[];
  likes: { userId: string }[];
  _count: { comments: number; votes: number };
};

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  post: { id: string; title: string; community: { slug: string } };
};

type Props = {
  posts: Post[];
  comments: Comment[];
  currentUserId?: string | null;
};

export default function ProfileTabs({ posts, comments, currentUserId }: Props) {
  const [tab, setTab] = useState<"posts" | "comments">("posts");

  return (
    <div>
      <div className="bg-white rounded-lg border border-[#edeff1] p-2 flex gap-2 mb-4">
        <button
          onClick={() => setTab("posts")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            tab === "posts" ? "bg-[#fff4f0] text-[#ff4500]" : "text-[#878a8c] hover:bg-[#f6f7f8]"
          }`}
        >
          Posts ({posts.length})
        </button>
        <button
          onClick={() => setTab("comments")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            tab === "comments" ? "bg-[#fff4f0] text-[#ff4500]" : "text-[#878a8c] hover:bg-[#f6f7f8]"
          }`}
        >
          Comments ({comments.length})
        </button>
      </div>

      {tab === "posts" && (
        <div className="flex flex-col gap-3">
          {posts.length === 0 ? (
            <EmptyState icon="📝" title="No posts yet" description="Posts will appear here" />
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={currentUserId} />
            ))
          )}
        </div>
      )}

      {tab === "comments" && (
        <div className="flex flex-col gap-3">
          {comments.length === 0 ? (
            <EmptyState icon="💬" title="No comments yet" description="Comments will appear here" />
          ) : (
            comments.map((comment) => (
              <Link
                key={comment.id}
                href={`/r/${comment.post.community.slug}/${comment.post.id}`}
                className="bg-white rounded-lg border border-[#edeff1] hover:border-[#878a8c] transition p-4 block"
              >
                <p className="text-xs text-[#878a8c] mb-1">
                  on: <span className="text-[#0079d3]">{comment.post.title}</span>
                </p>
                <p className="text-sm">{comment.content}</p>
                <p className="text-xs text-[#878a8c] mt-2">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
