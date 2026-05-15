"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") || "latest";

  function handleSort(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="bg-white rounded-lg border border-[#edeff1] p-2 flex gap-2 mb-4">
      <button
        onClick={() => handleSort("latest")}
        className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition ${
          current === "latest"
            ? "bg-[#e8f0fe] text-[#0079d3]"
            : "text-[#878a8c] hover:bg-[#f6f7f8]"
        }`}
      >
        🕐 Latest
      </button>
      <button
        onClick={() => handleSort("popular")}
        className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition ${
          current === "popular"
            ? "bg-[#fff4f0] text-[#ff4500]"
            : "text-[#878a8c] hover:bg-[#f6f7f8]"
        }`}
      >
        🔥 Popular
      </button>
    </div>
  );
}
