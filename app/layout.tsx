import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkyClaim · Flight Disruption Shield",
  description:
    "Autonomous EU261 & UK261 disruption screening and statutory claim verification for US-to-Europe flights. Powered by automated weather telemetry and Base Sepolia testnet.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0B1120] text-[#F8FAFC] antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
