import { CommunitySkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="h-8 bg-[#edeff1] rounded w-48 animate-pulse" />
        <div className="h-8 bg-[#edeff1] rounded-full w-24 animate-pulse" />
      </div>
      <div className="bg-white rounded-lg border border-[#edeff1] p-2 flex gap-2 mb-4 animate-pulse">
        <div className="h-8 bg-[#edeff1] rounded-full w-24" />
        <div className="h-8 bg-[#edeff1] rounded-full w-24" />
      </div>
      <div className="flex flex-col gap-3">
        {[...Array(5)].map((_, i) => <CommunitySkeleton key={i} />)}
      </div>
    </div>
  );
}
