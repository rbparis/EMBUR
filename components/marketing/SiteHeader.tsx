"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Show,
  UserButton,
} from "@clerk/nextjs";
import EmburLogo from "@/components/brand/EmburLogo";

const navigation = [
  {
    label: "Why EMBUR",
    href: "#why-embur",
  },
  {
    label: "See EMBUR",
    href: "#product",
  },
  {
    label: "Your Time Back",
    href: "#your-time-back",
  },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-slate-50/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a
          href="#top"
          aria-label="Return to the EMBUR homepage"
          className="shrink-0 rounded-xl"
          onClick={closeMenu}
        >
          <EmburLogo />
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 md:flex"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-1 py-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-white"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
            >
              Create Account
            </Link>
          </Show>

          <Show when="signed-in">
            <Link
              href="/app"
              prefetch={false}
              className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Open Workspace
            </Link>

            <UserButton />
          </Show>
        </div>

        <div className="relative md:hidden">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={
              menuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm transition hover:bg-slate-50"
          >
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Open menu"}
            </span>

            <span className="relative block h-5 w-5">
              <span
                className={`absolute left-0 top-1 h-0.5 w-5 rounded-full bg-current transition ${
                  menuOpen
                    ? "translate-y-1.5 rotate-45"
                    : ""
                }`}
              />

              <span
                className={`absolute left-0 top-2.5 h-0.5 w-5 rounded-full bg-current transition ${
                  menuOpen
                    ? "opacity-0"
                    : "opacity-100"
                }`}
              />

              <span
                className={`absolute left-0 top-4 h-0.5 w-5 rounded-full bg-current transition ${
                  menuOpen
                    ? "-translate-y-1.5 -rotate-45"
                    : ""
                }`}
              />
            </span>
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                aria-label="Close navigation"
                onClick={closeMenu}
                className="fixed inset-0 top-[77px] z-40 cursor-default bg-slate-950/20 backdrop-blur-[2px]"
              />

              <div
                id="mobile-navigation"
                className="absolute right-0 z-50 mt-3 w-[min(19rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl"
              >
                <nav
                  aria-label="Mobile navigation"
                  className="flex flex-col gap-1"
                >
                  {navigation.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"
                    >
                      {item.label}
                    </a>
                  ))}

                  <Show when="signed-out">
                    <Link
                      href="/sign-in"
                      onClick={closeMenu}
                      className="mt-2 rounded-xl border border-slate-200 px-4 py-3 text-center font-bold text-slate-700"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/sign-up"
                      onClick={closeMenu}
                      className="rounded-xl bg-blue-600 px-4 py-3 text-center font-bold text-white"
                    >
                      Create Account
                    </Link>
                  </Show>

                  <Show when="signed-in">
                    <Link
                      href="/app"
                      prefetch={false}
                      onClick={closeMenu}
                      className="mt-2 rounded-xl bg-blue-600 px-4 py-3 text-center font-bold text-white"
                    >
                      Open Workspace
                    </Link>

                    <div className="flex justify-center py-3">
                      <UserButton />
                    </div>
                  </Show>
                </nav>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}