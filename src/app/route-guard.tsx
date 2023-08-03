import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";

export default function RouteGuard({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname === "/login") {
    return children;
  }

  if (session === null) redirect("/login");

  return children;
}
