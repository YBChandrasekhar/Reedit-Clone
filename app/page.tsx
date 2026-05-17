export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg p-8 shadow text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-[#ff4500] mb-2">Reddit Clone</h1>
        <p className="text-[#878a8c] mb-6">
          A community platform — Day 1 setup complete ✅
        </p>
        <div className="flex flex-col gap-3">
          <a
            href="/sign-in"
            className="bg-[#ff4500] text-white rounded-full py-2 px-6 font-semibold hover:bg-[#e03d00] transition"
          >
            Log In
          </a>
          <a
            href="/sign-up"
            className="border border-[#ff4500] text-[#ff4500] rounded-full py-2 px-6 font-semibold hover:bg-orange-50 transition"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
