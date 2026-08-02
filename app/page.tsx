import type { Metadata } from "next";
import { headers } from "next/headers";
import HeroSection from "@/components/marketing/HeroSection";
import InvestmentCard from "@/components/marketing/InvestmentCard";
import {
  FinalCta,
  SiteFooter,
} from "@/components/marketing/LandingSections";
import SiteHeader from "@/components/marketing/SiteHeader";
import GrowthEngineSection from "@/components/marketing/GrowthEngineSection";
import WatchEmburWork from "@/components/marketing/WatchEmburWork";
import SiteActivityTracker from "@/components/marketing/SiteActivityTracker";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "embur-n6xd.vercel.app";
  const protocol = headerList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    openGraph: {
      title: "EMBUR - More Calls. More Jobs. More Money.",
      description: "Specialized agents that answer, book, follow up, ask for referrals, create, and improve.",
      url: origin,
      siteName: "EMBUR",
      images: [{ url: `${origin}/og.png`, width: 1733, height: 917, alt: "EMBUR - recover more work and carry less of it." }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "EMBUR - More Calls. More Jobs. More Money.",
      description: "Specialized agents that answer, book, follow up, ask for referrals, create, and improve.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#06142f]">
      <SiteActivityTracker />
      <SiteHeader />
      <HeroSection />
      <WatchEmburWork />
      <GrowthEngineSection />
      <InvestmentCard />
      <FinalCta />
      <SiteFooter />
    </main>
  );
}
