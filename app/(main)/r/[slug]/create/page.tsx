"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Image from "next/image";

type PostType = "text" | "image" | "link";

export default function CreatePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [communityId, setCommunityId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<PostType>("text");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`/api/communities/${slug}`).then((r) => r.json()).then((data) => setCommunityId(data.id));
  }, [slug]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("File must be under 5MB"); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    let imageUrl: string | null = null;

    if (type === "image") {
      if (!imageFile) { setError("Please select an image"); setLoading(false); return; }
      setUploading(true);
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      setUploading(false);
      if (!uploadRes.ok) { setError(uploadData.error); setLoading(false); return; }
      imageUrl = uploadData.url;
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content: type !== "image" ? content : null,
        imageUrl,
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
            <button
              key={t}
              type="button"
              onClick={() => { setType(t); setError(""); }}
              className={`px-4 py-2 text-sm font-semibold capitalize transition ${type === t ? "border-b-2 border-[#ff4500] text-[#ff4500]" : "text-[#878a8c] hover:text-black"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title *"
              className="w-full border border-[#edeff1] rounded px-3 py-2 text-sm outline-none focus:border-[#878a8c]"
              required
              maxLength={300}
            />
            <p className="text-xs text-[#878a8c] mt-1 text-right">{title.length}/300</p>
          </div>

          {type === "text" && (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Text (optional)"
              className="w-full border border-[#edeff1] rounded px-3 py-2 text-sm outline-none focus:border-[#878a8c] resize-none"
              rows={6}
            />
          )}

          {type === "image" && (
            <div className="flex flex-col gap-3">
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={600}
                    height={400}
                    className="rounded-lg w-full object-cover max-h-64"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black transition"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#edeff1] rounded-lg p-8 cursor-pointer hover:border-[#878a8c] transition">
                  <span className="text-3xl mb-2">📷</span>
                  <span className="text-sm font-semibold text-[#878a8c]">Click to upload image</span>
                  <span className="text-xs text-[#878a8c] mt-1">JPEG, PNG, WEBP, GIF — max 5MB</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

          {type === "link" && (
            <input
              type="url"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="URL"
              className="w-full border border-[#edeff1] rounded px-3 py-2 text-sm outline-none focus:border-[#878a8c]"
            />
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="border border-[#878a8c] text-[#878a8c] rounded-full px-4 py-2 text-sm font-semibold hover:border-black hover:text-black transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title || !communityId}
              className="bg-[#ff4500] text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#e03d00] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
