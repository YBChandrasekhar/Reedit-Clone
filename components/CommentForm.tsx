"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: { username: string };
};

type Props = {
  postId: string;
  onCommentAdded: (comment: Comment) => void;
};

export default function CommentForm({ postId, onCommentAdded }: Props) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignedIn) { router.push("/sign-in"); return; }
    if (!content.trim()) return;
    setError("");
    setLoading(true);

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error); return; }
    setContent("");
    onCommentAdded(data);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isSignedIn ? "What are your thoughts?" : "Sign in to comment"}
        disabled={!isSignedIn}
        className="w-full border border-[#edeff1] rounded px-3 py-2 text-sm outline-none focus:border-[#878a8c] resize-none disabled:bg-[#f8f9fa] disabled:cursor-not-allowed"
        rows={4}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={loading || !content.trim() || !isSignedIn}
          className="bg-[#ff4500] text-white rounded-full px-4 py-1 text-sm font-semibold hover:bg-[#e03d00] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Posting..." : "Comment"}
        </button>
      </div>
    </form>
  );
}
