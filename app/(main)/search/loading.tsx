import { PostSkeleton, CommunitySkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-4 border border-[#edeff1] mb-4 animate-pulse">
        <div className="h-5 bg-[#edeff1] rounded w-48 mb-2" />
        <div className="h-3 bg-[#edeff1] rounded w-24" />
      </div>
      <div className="mb-4">
        <div className="h-3 bg-[#edeff1] rounded w-24 mb-2 animate-pulse" />
        <div className="flex flex-col gap-2">
          {[...Array(2)].map((_, i) => <CommunitySkeleton key={i} />)}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}
      </div>
    </div>
  );
}
