"use client";
import envs from "@App/envs";

import { redirect } from "next/navigation";

import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") return <>loading</>;
  if (
    !session ||
    (status === "authenticated" && session?.user?.email !== envs.ADMIN_EMAIL)
  )
    redirect("/");

  return <>Private page</>;
}
