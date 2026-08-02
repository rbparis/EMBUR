"use client";

import { useState } from "react";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import EmburLogo from "@/components/brand/EmburLogo";

const navigation = [
  { label: "Watch", href: "#watch" },
  { label: "Agents", href: "#agents" },
  { label: "Plans", href: "#investment" },
  { label: "Field notes", href: "/blog" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#04112b]/90 text-white backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-[90rem] items-center justify-between px-5 md:px-8">
        <a href="#top" aria-label="Return to the EMBUR homepage" onClick={() => setMenuOpen(false)} className="rounded-xl">
          <EmburLogo light />
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-1 py-2 text-sm font-semibold text-[#9eb0ce] transition hover:text-white">{item.label}</Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Show when="signed-out">
            <Link href="/sign-in" className="rounded-full px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/10">Sign in</Link>
            <Link href="/sign-up" className="rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-[#061027] transition hover:-translate-y-0.5 hover:bg-blue-50">Sign up</Link>
          </Show>
          <Show when="signed-in">
            <Link href="/app" prefetch={false} className="rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-[#061027] transition hover:-translate-y-0.5">Open command center</Link>
            <UserButton />
          </Show>
        </div>

        <button type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((current) => !current)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] md:hidden">
          <span className="text-xl leading-none">{menuOpen ? "×" : "☰"}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#06142f] px-5 py-5 md:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 font-semibold text-slate-200 hover:bg-white/10">{item.label}</Link>
            ))}
            <Show when="signed-out">
              <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="mt-2 rounded-xl border border-white/15 px-4 py-3 text-center font-bold">Sign in</Link>
              <Link href="/sign-up" onClick={() => setMenuOpen(false)} className="rounded-xl bg-white px-4 py-3 text-center font-extrabold text-[#061027]">Sign up</Link>
            </Show>
          </nav>
        </div>
      )}
    </header>
  );
}
