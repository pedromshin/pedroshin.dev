"use client";
import { signIn } from "next-auth/react";

export default function Page() {
  return (
    <main className="">
      <button onClick={() => signIn("github")}>login with github</button>
    </main>
  );
}
