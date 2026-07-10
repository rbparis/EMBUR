import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMBUR",
  description: "Returning time to local service business owners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}