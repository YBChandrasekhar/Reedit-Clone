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
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#edeff1] rounded-full" />
        <div>
          <div className="h-4 bg-[#edeff1] rounded w-32 mb-2" />
          <div className="h-3 bg-[#edeff1] rounded w-48" />
        </div>
      </div>
      <div className="h-3 bg-[#edeff1] rounded w-16 self-center" />
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="border-l-2 border-[#edeff1] pl-4 animate-pulse">
      <div className="h-3 bg-[#edeff1] rounded w-1/4 mb-2" />
      <div className="h-3 bg-[#edeff1] rounded w-full mb-1" />
      <div className="h-3 bg-[#edeff1] rounded w-3/4" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-[#edeff1] overflow-hidden animate-pulse">
      <div className="h-16 bg-[#edeff1]" />
      <div className="px-4 pb-4">
        <div className="w-16 h-16 rounded-full bg-[#edeff1] border-4 border-white -mt-8 mb-3" />
        <div className="h-5 bg-[#edeff1] rounded w-32 mb-2" />
        <div className="h-3 bg-[#edeff1] rounded w-24" />
      </div>
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-[#edeff1] p-6 animate-pulse">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-4 h-4 bg-[#edeff1] rounded" />
          <div className="w-6 h-3 bg-[#edeff1] rounded" />
          <div className="w-4 h-4 bg-[#edeff1] rounded" />
        </div>
        <div className="flex-1">
          <div className="h-3 bg-[#edeff1] rounded w-1/3 mb-3" />
          <div className="h-6 bg-[#edeff1] rounded w-3/4 mb-4" />
          <div className="h-3 bg-[#edeff1] rounded w-full mb-2" />
          <div className="h-3 bg-[#edeff1] rounded w-full mb-2" />
          <div className="h-3 bg-[#edeff1] rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}
