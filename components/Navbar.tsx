"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useAuth, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const username = user?.username ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0];

  return (
    <header className="bg-white border-b border-[#edeff1] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
        <Link href="/" className="text-[#ff4500] font-bold text-xl shrink-0">
          reddit<span className="text-black">clone</span>
        </Link>

        <div className="hidden sm:flex flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search Reddit Clone"
            className="w-full border border-[#edeff1] rounded-full px-4 py-1 text-sm outline-none focus:border-[#878a8c] bg-[#f6f7f8]"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/communities" className="hidden sm:block text-sm text-[#878a8c] hover:text-black transition px-2">
            Communities
          </Link>

          {!isSignedIn ? (
            <>
              <SignInButton mode="redirect">
                <button className="border border-[#ff4500] text-[#ff4500] rounded-full px-3 py-1 text-sm font-semibold hover:bg-orange-50 transition">
                  Log In
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button className="bg-[#ff4500] text-white rounded-full px-3 py-1 text-sm font-semibold hover:bg-[#e03d00] transition">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link href="/communities/create" className="hidden sm:block bg-[#ff4500] text-white rounded-full px-3 py-1 text-sm font-semibold hover:bg-[#e03d00] transition">
                + Create
              </Link>
              {username && (
                <Link href={`/u/${username}`} className="hidden sm:block text-sm text-[#878a8c] hover:text-black transition px-2">
                  Profile
                </Link>
              )}
              <UserButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
