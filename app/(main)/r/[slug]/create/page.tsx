"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

type PostType = "text" | "image" | "link";

export default function CreatePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [communityId, setCommunityId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState<PostType>("text");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/communities/${slug}`)
      .then((r) => r.json())
      .then((data) => setCommunityId(data.id));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content: type === "text" ? content : type === "link" ? content : null,
        imageUrl: type === "image" ? imageUrl : null,
        type,
        communityId,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error); return; }
    router.push(`/r/${slug}/${data.id}`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-6 border border-[#edeff1]">
        <h1 className="text-xl font-bold mb-1">Create a Post</h1>
        <p className="text-sm text-[#878a8c] mb-6">r/{slug}</p>

        <div className="flex border-b border-[#edeff1] mb-6">
          {(["text", "image", "link"] as PostType[]).map((t) => (
            <button key={t} type="button" onClick={() => setType(t)}
              className={`px-4 py-2 text-sm font-semibold capitalize transition ${type === t ? "border-b-2 border-[#ff4500] text-[#ff4500]" : "text-[#878a8c] hover:text-black"}`}>
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Title *"
              className="w-full border border-[#edeff1] rounded px-3 py-2 text-sm outline-none focus:border-[#878a8c]"
              required maxLength={300} />
            <p className="text-xs text-[#878a8c] mt-1 text-right">{title.length}/300</p>
          </div>

          {type === "text" && (
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Text (optional)"
              className="w-full border border-[#edeff1] rounded px-3 py-2 text-sm outline-none focus:border-[#878a8c] resize-none"
              rows={6} />
          )}
          {type === "image" && (
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL"
              className="w-full border border-[#edeff1] rounded px-3 py-2 text-sm outline-none focus:border-[#878a8c]" />
          )}
          {type === "link" && (
            <input type="url" value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="URL"
              className="w-full border border-[#edeff1] rounded px-3 py-2 text-sm outline-none focus:border-[#878a8c]" />
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => router.back()}
              className="border border-[#878a8c] text-[#878a8c] rounded-full px-4 py-2 text-sm font-semibold hover:border-black hover:text-black transition">
              Cancel
            </button>
            <button type="submit" disabled={loading || !title || !communityId}
              className="bg-[#ff4500] text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#e03d00] transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
