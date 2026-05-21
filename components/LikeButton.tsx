"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type Props = {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
};

export default function LikeButton({ postId, initialLikes, initialLiked }: Props) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (!isSignedIn) { router.push("/sign-in"); return; }
    if (loading) return;
    setLoading(true);

    const prevLiked = liked;
    const prevLikes = likes;
    setLiked(!liked);
    setLikes((l) => l + (liked ? -1 : 1));

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      if (!res.ok) { setLiked(prevLiked); setLikes(prevLikes); }
    } catch {
      setLiked(prevLiked);
      setLikes(prevLikes);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-1 text-xs transition disabled:opacity-50 ${
        liked ? "text-pink-500" : "text-[#878a8c] hover:text-pink-500"
      }`}
      title={liked ? "Unlike" : "Like"}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>{likes}</span>
    </button>
  );
}
