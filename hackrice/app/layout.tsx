import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SessionWrapper } from "@/components/SessionWrapper"; // <-- client wrapper


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "O'Hare Air - Freshest Air in Thneedville",
  description: "Personalized air quality monitoring and lung health guidance - Freshest Air in Thneedville",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(`${geistSans.variable} ${geistMono.variable} antialiased`, "min-h-screen bg-background")}
      >
        {/* Wrap client-only components */}
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}