"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type Props = {
  postId: string;
  initialVotes: number;
  initialUserVote?: "UP" | "DOWN" | null;
};

export default function VoteButton({ postId, initialVotes, initialUserVote }: Props) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<"UP" | "DOWN" | null>(initialUserVote ?? null);
  const [loading, setLoading] = useState(false);

  async function handleVote(type: "UP" | "DOWN") {
    if (!isSignedIn) { router.push("/sign-in"); return; }
    if (loading) return;
    setLoading(true);

    const prevVotes = votes;
    const prevUserVote = userVote;

    if (userVote === type) {
      setUserVote(null);
      setVotes((v) => v + (type === "UP" ? -1 : 1));
    } else {
      const diff = type === "UP" ? 1 : -1;
      const prevDiff = userVote ? (userVote === "UP" ? -1 : 1) : 0;
      setVotes((v) => v + diff + prevDiff);
      setUserVote(type);
    }

    try {
      const res = await fetch(`/api/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (!res.ok) { setVotes(prevVotes); setUserVote(prevUserVote); }
    } catch {
      setVotes(prevVotes);
      setUserVote(prevUserVote);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => handleVote("UP")}
        className={`p-1 rounded hover:bg-orange-50 transition ${userVote === "UP" ? "text-[#ff4500]" : "text-[#878a8c]"}`}
        aria-label="Upvote">
        <svg width="16" height="16" viewBox="0 0 24 24" fill={userVote === "UP" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
      <span className={`text-xs font-bold min-w-[20px] text-center ${
        userVote === "UP" ? "text-[#ff4500]" : userVote === "DOWN" ? "text-[#7193ff]" : "text-[#1c1c1c]"
      }`}>{votes}</span>
      <button onClick={() => handleVote("DOWN")}
        className={`p-1 rounded hover:bg-blue-50 transition ${userVote === "DOWN" ? "text-[#7193ff]" : "text-[#878a8c]"}`}
        aria-label="Downvote">
        <svg width="16" height="16" viewBox="0 0 24 24" fill={userVote === "DOWN" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </button>
    </div>
  );
}
