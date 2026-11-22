import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkyClaim · Autonomous Flight Disruption & Claim Verifier",
  description: "High-end autonomous EU261/UK261 flight disruption claim intelligence powered by dual-miner consensus on Telegraph Protocol (H2 Hackathon Mission 15)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#060709] text-gray-100 selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
