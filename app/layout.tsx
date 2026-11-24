import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://skyclaim.pro"),
  title: "SkyClaim · Flight Disruption Shield",
  description:
    "Autonomous EU261 & UK261 disruption screening and statutory claim verification for US-to-Europe flights powered by automated weather telemetry.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
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
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#0B1226] text-[#F8FAFC] font-sans antialiased selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
