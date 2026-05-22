import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white rounded-lg p-12 text-center border border-[#edeff1]">
        <p className="text-5xl mb-4">🔒</p>
        <h1 className="text-xl font-bold mb-2">Sign in required</h1>
        <p className="text-[#878a8c] text-sm mb-6">
          You need to be signed in to access this page.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/sign-in"
            className="bg-[#ff4500] text-white rounded-full py-2 text-sm font-semibold hover:bg-[#e03d00] transition text-center"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="border border-[#ff4500] text-[#ff4500] rounded-full py-2 text-sm font-semibold hover:bg-orange-50 transition text-center"
          >
            Create Account
          </Link>
          <Link
            href="/"
            className="text-sm text-[#878a8c] hover:text-black transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
