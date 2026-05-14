"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <header className="bg-white border-b border-[#edeff1] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link href="/" className="text-[#ff4500] font-bold text-xl">
          reddit<span className="text-black">clone</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/communities" className="text-sm text-[#878a8c] hover:text-black transition">
            Communities
          </Link>

          {!isSignedIn ? (
            <>
              <SignInButton mode="redirect">
                <button className="border border-[#ff4500] text-[#ff4500] rounded-full px-4 py-1 text-sm font-semibold hover:bg-orange-50 transition">
                  Log In
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button className="bg-[#ff4500] text-white rounded-full px-4 py-1 text-sm font-semibold hover:bg-[#e03d00] transition">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link
                href="/communities/create"
                className="bg-[#ff4500] text-white rounded-full px-4 py-1 text-sm font-semibold hover:bg-[#e03d00] transition"
              >
                Create Community
              </Link>
              <UserButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
