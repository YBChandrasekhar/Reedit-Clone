import { PostSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-6 border border-[#edeff1] mb-4 animate-pulse">
        <div className="h-7 bg-[#edeff1] rounded w-40 mb-2" />
        <div className="h-3 bg-[#edeff1] rounded w-56" />
      </div>
      <div className="flex flex-col gap-3">
        {[...Array(5)].map((_, i) => <PostSkeleton key={i} />)}
      </div>
    </div>
  );
}
