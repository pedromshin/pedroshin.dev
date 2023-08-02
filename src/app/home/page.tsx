"use client";
import { signOut } from "next-auth/react";

export default function Page() {
  return (
    <main className="">
      <button onClick={() => signOut()}>signout</button>
    </main>
  );
}
