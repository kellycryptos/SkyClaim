import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Telegraph Sentinel · Autonomous Listings & Risk Desk",
  description: "Machine-to-machine token due diligence desk powered by Telegraph Protocol (H2 Hackathon Mission 01 & 14)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-gray-100 selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
