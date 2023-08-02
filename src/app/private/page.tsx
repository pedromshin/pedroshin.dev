// "use client";
import envs from "@Src/envs";
import { getServerSession } from "next-auth";
import { authOptions } from "@Api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session?.user?.email !== envs.ADMIN_EMAIL) redirect("/home");

  return (
    <main className="">
      <button>private page</button>
    </main>
  );
}
