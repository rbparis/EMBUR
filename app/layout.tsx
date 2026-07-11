import type { Metadata, Viewport } from "next";
import SkipLink from "@/components/ui/SkipLink";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "EMBUR — Get Your Time Back",
    template: "%s | EMBUR",
  },
  description:
    "EMBUR helps local service businesses recover missed opportunities, organize priorities, and return time to the owner.",
  applicationName: "EMBUR",
  keywords: [
    "local service business",
    "missed call recovery",
    "customer follow-up",
    "business operations",
    "time returned",
    "HVAC software",
  ],
  icons: {
    icon: "/embur-logo.png",
    apple: "/embur-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}