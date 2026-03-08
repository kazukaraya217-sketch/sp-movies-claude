import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "S-P Movies",
  description: "Download movies from Telegram and Terabox",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-netflix-black min-h-screen">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}