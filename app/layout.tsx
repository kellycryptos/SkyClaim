import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://skyclaim.pro"),
  title: "SkyClaim · Flight Disruption Shield",
  description:
    "Autonomous EU261 & UK261 disruption screening and statutory claim verification for US-to-Europe flights powered by automated weather telemetry.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "SkyClaim · Flight Disruption Shield",
    description:
      "Checks the airline's weather excuse before you file a delay claim. Autonomous EU261 & UK261 flight disruption verification.",
    url: "https://skyclaim.pro",
    siteName: "SkyClaim",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SkyClaim · Flight Disruption Shield",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkyClaim · Flight Disruption Shield",
    description:
      "Checks the airline's weather excuse before you file a delay claim. Powered by Telegraph Protocol x402 on Base Sepolia.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090E1A] text-[#F8FAFC] antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
