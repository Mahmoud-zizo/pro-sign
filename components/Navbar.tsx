"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

const NAV_LINKS = [
  { name: "Home", href: "#" },
  { name: "About us", href: "#about-us" },
  { name: "Services", href: "#services" },
  { name: "Contact us", href: "#footer" },
];

type Props = { session: Session | null };

export default function Navbar({ session }: Props) {
  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";
  const userName = session?.user?.name?.split(" ")[0] ?? "Account";
  const userInitial = (session?.user?.name ??
    session?.user?.email ??
    "U")[0].toUpperCase();
  const dashboardHref = isAdmin ? "/admin" : "/dashboard";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  async function handleSignOut() {
    setDropOpen(false);
    setMenuOpen(false);
    await signOut({ callbackUrl: "/" });
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <>
      <nav
        className={[
          "flex items-center justify-between glass",
          "sticky top-0 left-0 right-0 z-100 h-15",
          "px-4 sm:px-6 lg:px-10",
          "transition-all duration-300",
          scrolled
            ? "bg-[rgba(240,242,245,0.88)] backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            : "bg-transparent",
        ].join(" ")}
      >
        {/* Logo */}
        <Link href="/" className="flex flex-row items-center gap-2">
          <Image
            src="/images/logo2.jpg"
            alt="logo"
            width={40}
            height={40}
            className="rounded-[15px] object-cover"
          />
          <p className="text-xl font-bold">Pro Sign</p>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {NAV_LINKS.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="text-normal font-medium text-[#444] no-underline transition-colors duration-200 hover:text-[#0f1117]"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                  bg-white border border-slate-200 hover:border-slate-300
                  shadow-sm transition-all duration-150 cursor-pointer"
              >
                <div
                  className="w-7 h-7 rounded-full bg-red-500 text-white
                  flex items-center justify-center text-xs font-bold"
                >
                  {userInitial}
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {userName}
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    dropOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              {dropOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl
                  border border-slate-100 py-1.5 overflow-hidden z-200
                  animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <Link
                    href={dashboardHref}
                    onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700
                      hover:bg-slate-50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                      />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    {isAdmin ? "Admin Panel" : "My Dashboard"}
                  </Link>

                  {!isAdmin && (
                    <Link
                      href="/book"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700
                        hover:bg-slate-50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Book a Service
                    </Link>
                  )}

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm
                      text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="btn bg-red-500 text-white">Book Now</button>
            </Link>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          className="md:hidden flex flex-col gap-1.25 bg-transparent border-none cursor-pointer p-1"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-5.5 h-0.5 bg-[#0f1117] rounded-sm transition-all duration-250"
              style={{
                transform:
                  menuOpen && i === 0
                    ? "rotate(45deg) translate(5px,5px)"
                    : menuOpen && i === 2
                      ? "rotate(-45deg) translate(5px,-5px)"
                      : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed top-15 left-0 right-0 z-99 bg-[rgba(240,242,245,0.97)]
            backdrop-blur-md border-b border-black/8 px-6 pt-5 pb-7 flex flex-col gap-4"
          style={{ animation: "slideDown 0.22s ease" }}
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-base text-[#444] no-underline font-medium"
            >
              {item.name}
            </Link>
          ))}

          <div className="border-t border-black/6 pt-4 flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 px-1">
                  <div
                    className="w-8 h-8 rounded-full bg-red-500 text-white
                    flex items-center justify-center text-sm font-bold shrink-0"
                  >
                    {userInitial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>

                <Link
                  href={dashboardHref}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  {isAdmin ? "Admin Panel" : "My Dashboard"}
                </Link>

                {!isAdmin && (
                  <Link
                    href="/book"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    Book a Service
                  </Link>
                )}

                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white
                    text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full block text-center px-4 py-2.5 bg-red-500 hover:bg-red-600
                  text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
