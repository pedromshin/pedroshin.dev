"use client";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Button from "@App/components/atoms/Button";
import { IconBrandGoogle, IconBrandGithub } from "@tabler/icons-react";

export default () => {
  const { data: session } = useSession();

  if (session) redirect("/");

  return (
    <main className="h-full w-full flex flex-col items-center justify-center">
      <div className="flex flex-col p-16 border rounded-3xl gap-y-6">
        <h1 className="text-4xl">Login</h1>
        <Button onClick={() => signIn("github")}>
          <IconBrandGithub className="mr-2" />
          GitHub
        </Button>
        <Button onClick={() => signIn("google")}>
          <IconBrandGoogle className="mr-2" />
          Google
        </Button>
      </div>
    </main>
  );
};
