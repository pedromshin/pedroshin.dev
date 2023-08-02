"use client";
import { signOut } from "next-auth/react";
import PageContainer from "@Components/templates/PageContainer";

export default function Page() {
  return (
    <PageContainer>
      <button onClick={() => signOut()}>signout</button>
    </PageContainer>
  );
}
