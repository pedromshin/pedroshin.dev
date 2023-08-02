"use client";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();

  if (session) redirect("/home");

  return (
    <main className="">
      <button onClick={() => signIn("github")}>login with github</button>
    </main>
  );
}
