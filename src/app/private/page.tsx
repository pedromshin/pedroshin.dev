"use client";
import envs from "@Src/envs";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@Api/auth/[...nextauth]/route";
import PageContainer from "@Components/templates/PageContainer";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session?.user?.email !== envs.ADMIN_EMAIL) redirect("/home");

  return (
    <PageContainer>
      <></>
    </PageContainer>
  );
}
