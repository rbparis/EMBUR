"use client";

import { useEffect } from "react";

function visitorId() {
  const key = "embur:visitor";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  window.localStorage.setItem(key, created);
  return created;
}

function track(event: string, label?: string) {
  void fetch("/api/metrics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, label, visitorId: visitorId(), path: window.location.pathname }),
    keepalive: true,
  });
}

export default function SiteActivityTracker() {
  useEffect(() => {
    const viewKey = `embur:landing:${new Date().toISOString().slice(0, 10)}`;
    if (!window.sessionStorage.getItem(viewKey)) {
      track("landing_view");
      window.sessionStorage.setItem(viewKey, "1");
    }

    const pricing = document.getElementById("investment");
    const observer = pricing ? new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const key = "embur:pricing-view";
      if (!window.sessionStorage.getItem(key)) {
        track("pricing_view");
        window.sessionStorage.setItem(key, "1");
      }
      observer?.disconnect();
    }, { threshold: 0.35 }) : null;
    if (pricing && observer) observer.observe(pricing);

    function onClick(event: MouseEvent) {
      const link = (event.target as HTMLElement).closest("a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (href.includes("/app/billing") || href.includes("/sign-up") || href.includes("/sign-in")) {
        track("cta_click", link.textContent?.trim() || href);
      }
    }
    document.addEventListener("click", onClick);
    return () => {
      observer?.disconnect();
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
