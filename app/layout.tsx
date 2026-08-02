import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Manrope, Space_Grotesk } from "next/font/google";
import SkipLink from "@/components/ui/SkipLink";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });

export const metadata: Metadata = {
  title: { default: "EMBUR - More Calls. More Jobs. More Money.", template: "%s | EMBUR" },
  description: "EMBUR puts specialized agents on calls, booking, follow-up, referrals, reputation, content, and traffic for local service businesses.",
  applicationName: "EMBUR",
  keywords: ["local service business", "missed call recovery", "customer follow-up", "business operations", "time returned", "HVAC software"],
  icons: { icon: "/embur-mark.svg", apple: "/embur-logo.png" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#061027" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${manrope.variable} ${spaceGrotesk.variable}`}>
        <ClerkProvider>
          <SkipLink />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
