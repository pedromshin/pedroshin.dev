import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@Api/auth/[...nextauth]/route";

export default async function Page() {
  const session = await getServerSession(authOptions);
  redirect("/home");
}
