import { PostSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto flex gap-6">
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-lg border border-[#edeff1] p-2 flex gap-2 mb-4 animate-pulse">
          <div className="h-8 bg-[#edeff1] rounded-full w-24" />
          <div className="h-8 bg-[#edeff1] rounded-full w-24" />
          <div className="h-8 bg-[#edeff1] rounded-full w-24" />
        </div>
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => <PostSkeleton key={i} />)}
        </div>
      </div>
      <div className="w-72 shrink-0 hidden md:block">
        <div className="bg-white rounded-lg border border-[#edeff1] h-48 animate-pulse" />
      </div>
    </div>
  );
}
