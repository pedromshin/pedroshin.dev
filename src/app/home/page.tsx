"use client";
import { signOut } from "next-auth/react";
import PageContainer from "@Components/templates/PageContainer";

export default function Page() {
  return (
    <PageContainer>
      <main className="">
        <button onClick={() => signOut()}>signout</button>
      </main>
    </PageContainer>
  );
}
