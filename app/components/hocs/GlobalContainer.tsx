"use client";
import { ReactNode } from "react";
import Header from "@Components/organisms/Header";

export default ({ children }: { children: ReactNode }) => {
  return (
    <main className="h-full">
      <Header />
      {children}
    </main>
  );
};
