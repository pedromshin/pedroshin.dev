"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();

  session ? redirect("/home") : redirect("/login");
}
