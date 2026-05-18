"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    if (q.length < 2) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setSearch("");
    setMenuOpen(false);
  }
  const username =
    user?.username ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0];

  const navLinks = [
    { href: "/", label: "🏠 Home" },
    { href: "/trending", label: "🔥 Trending" },
    { href: "/communities", label: "🏘️ Communities" },
  ];

  return (
    <header className="bg-white border-b border-[#edeff1] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="text-[#ff4500] font-bold text-xl shrink-0">
          reddit<span className="text-black">clone</span>
        </Link>

        {/* Search — desktop */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Reddit Clone"
            className="w-full border border-[#edeff1] rounded-full px-4 py-1 text-sm outline-none focus:border-[#878a8c] bg-[#f6f7f8]"
          />
        </form>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition px-2 py-1 rounded ${
                pathname === l.href ? "text-[#ff4500]" : "text-[#878a8c] hover:text-black"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {!isSignedIn ? (
            <>
              <SignInButton mode="redirect">
                <button className="border border-[#ff4500] text-[#ff4500] rounded-full px-3 py-1 text-sm font-semibold hover:bg-orange-50 transition ml-2">
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
              <Link
                href="/communities/create"
                className="bg-[#ff4500] text-white rounded-full px-3 py-1 text-sm font-semibold hover:bg-[#e03d00] transition ml-2"
              >
                + Create
              </Link>
              {username && (
                <Link
                  href={`/u/${username}`}
                  className="text-sm text-[#878a8c] hover:text-black transition px-2"
                >
                  Profile
                </Link>
              )}
              <UserButton />
            </>
          )}
        </div>

        {/* Mobile: auth + hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="redirect">
              <button className="border border-[#ff4500] text-[#ff4500] rounded-full px-3 py-1 text-xs font-semibold">
                Log In
              </button>
            </SignInButton>
          )}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-1 text-[#878a8c] hover:text-black transition"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-[#edeff1] px-4 py-3 flex flex-col gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium py-2 px-3 rounded transition ${
                pathname === l.href ? "bg-[#fff4f0] text-[#ff4500]" : "text-[#878a8c] hover:bg-[#f6f7f8]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <form onSubmit={handleSearch} className="flex mt-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Reddit Clone"
              className="w-full border border-[#edeff1] rounded-full px-4 py-2 text-sm outline-none focus:border-[#878a8c] bg-[#f6f7f8]"
            />
          </form>
          {isSignedIn && (
            <>
              <Link
                href="/communities/create"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium py-2 px-3 rounded text-[#878a8c] hover:bg-[#f6f7f8] transition"
              >
                + Create Community
              </Link>
              {username && (
                <Link
                  href={`/u/${username}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium py-2 px-3 rounded text-[#878a8c] hover:bg-[#f6f7f8] transition"
                >
                  👤 Profile
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
}
