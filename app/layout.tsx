"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import RouteGuard from "@Components/hocs/RouteGuard";
import GlobalContainer from "@Components/hocs/GlobalContainer";
import { Analytics } from "@vercel/analytics/react"
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
          <RouteGuard>
            <GlobalContainer>{children}</GlobalContainer>
          </RouteGuard>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
