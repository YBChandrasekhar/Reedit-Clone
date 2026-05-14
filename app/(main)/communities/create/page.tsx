"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCommunityPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push(`/r/${data.slug}`);
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-lg p-6 border border-[#edeff1]">
        <h1 className="text-xl font-bold mb-6">Create a Community</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Community Name <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-[#edeff1] rounded px-3 py-2 focus-within:border-[#878a8c]">
              <span className="text-[#878a8c] text-sm">r/</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="community_name"
                className="flex-1 outline-none text-sm ml-1"
                required
                minLength={3}
                maxLength={21}
              />
            </div>
            <p className="text-xs text-[#878a8c] mt-1">Min 3 characters, max 21</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is your community about?"
              className="w-full border border-[#edeff1] rounded px-3 py-2 text-sm outline-none focus:border-[#878a8c] resize-none"
              rows={3}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || name.length < 3}
            className="bg-[#ff4500] text-white rounded-full py-2 font-semibold text-sm hover:bg-[#e03d00] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Community"}
          </button>
        </form>
      </div>
    </div>
  );
}
