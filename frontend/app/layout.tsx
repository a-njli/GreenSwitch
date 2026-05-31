import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoSwap — Find Greener Everyday Products",
  description: "Discover eco-friendly alternatives with shop links, carbon savings, and easy comparisons",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
