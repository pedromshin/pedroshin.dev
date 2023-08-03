"use client";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Button from "@Components/atoms/Button";
import { IconBrandGoogle, IconBrandGithub } from "@tabler/icons-react";

export default function Page() {
  const { data: session } = useSession();

  if (session) redirect("/home");

  return (
    <main className="h-full w-full flex flex-col items-center justify-center">
      <div className="flex flex-col p-16 border rounded-3xl gap-y-6">
        <h1 className="text-4xl">Login</h1>
        <Button callback={() => signIn("github")}>
          <IconBrandGithub className="mr-2" />
          GitHub
        </Button>
        <Button callback={() => signIn("google")}>
          <IconBrandGoogle className="mr-2" />
          Google
        </Button>
      </div>
    </main>
  );
}
