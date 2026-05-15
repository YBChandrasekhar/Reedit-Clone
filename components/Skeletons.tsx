export function PostSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-[#edeff1] flex animate-pulse">
      <div className="w-12 bg-[#f8f9fa] rounded-l-lg p-3 flex flex-col items-center gap-2">
        <div className="w-4 h-4 bg-[#edeff1] rounded" />
        <div className="w-6 h-3 bg-[#edeff1] rounded" />
        <div className="w-4 h-4 bg-[#edeff1] rounded" />
      </div>
      <div className="flex-1 p-4">
        <div className="h-3 bg-[#edeff1] rounded w-1/4 mb-2" />
        <div className="h-5 bg-[#edeff1] rounded w-3/4 mb-2" />
        <div className="h-3 bg-[#edeff1] rounded w-full mb-1" />
        <div className="h-3 bg-[#edeff1] rounded w-2/3" />
        <div className="flex gap-4 mt-3">
          <div className="h-3 bg-[#edeff1] rounded w-16" />
          <div className="h-3 bg-[#edeff1] rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function CommunitySkeleton() {
  return (
    <div className="bg-white rounded-lg border border-[#edeff1] p-4 flex justify-between animate-pulse">
      <div>
        <div className="h-4 bg-[#edeff1] rounded w-32 mb-2" />
        <div className="h-3 bg-[#edeff1] rounded w-48" />
      </div>
      <div className="h-3 bg-[#edeff1] rounded w-16" />
    </div>
  );
}
