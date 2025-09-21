"use client";

import { SessionProvider } from "next-auth/react";
import { Navbar } from "./ui/navbar";

export function SessionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </SessionProvider>
  );
}