import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#dae0e6] flex items-center justify-center">
      <div className="bg-white rounded-lg p-12 text-center border border-[#edeff1] max-w-md w-full mx-4">
        <p className="text-6xl mb-4">🤔</p>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-[#878a8c] text-sm mb-6">
          The page you're looking for doesn't exist or has been removed.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="bg-[#ff4500] text-white rounded-full py-2 text-sm font-semibold hover:bg-[#e03d00] transition text-center"
          >
            Go Home
          </Link>
          <Link
            href="/communities"
            className="border border-[#ff4500] text-[#ff4500] rounded-full py-2 text-sm font-semibold hover:bg-orange-50 transition text-center"
          >
            Browse Communities
          </Link>
        </div>
      </div>
    </div>
  );
}
