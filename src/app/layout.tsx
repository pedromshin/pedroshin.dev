"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import RouteGuard from "./route-guard";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full overflow-hidden">
      <body
        className={`${inter.className} h-full overflow-y-scroll overflow-x-hidden`}
      >
        <SessionProvider>
          <RouteGuard>{children} </RouteGuard>
        </SessionProvider>
      </body>
    </html>
  );
}
