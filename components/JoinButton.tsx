"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

type Props = {
  slug: string;
  initialJoined: boolean;
  initialCount: number;
};

export default function JoinButton({ slug, initialJoined, initialCount }: Props) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [joined, setJoined] = useState(initialJoined);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (!isSignedIn) { router.push("/sign-in"); return; }
    if (loading) return;
    setLoading(true);

    const prevJoined = joined;
    const prevCount = count;
    setJoined(!joined);
    setCount((c) => c + (joined ? -1 : 1));

    const res = await fetch(`/api/communities/${slug}/membership`, { method: "POST" });
    if (!res.ok) {
      setJoined(prevJoined);
      setCount(prevCount);
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[#878a8c]">{count.toLocaleString()} members</span>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`rounded-full px-4 py-1 text-sm font-semibold transition disabled:opacity-50 ${
          joined
            ? "border border-[#878a8c] text-[#878a8c] hover:border-red-400 hover:text-red-400"
            : "bg-[#ff4500] text-white hover:bg-[#e03d00]"
        }`}
      >
        {loading ? "..." : joined ? "Joined ✓" : "Join"}
      </button>
    </div>
  );
}
