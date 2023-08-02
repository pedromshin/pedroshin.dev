"use client";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();

  if (session) redirect("/home");

  const githubSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      height={20}
      width={20}
    >
      <path
        fillRule="evenodd"
        d="M10 0a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.61-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.61.07-.6.07-.6 1 .07 1.52 1.03 1.52 1.03.88 1.51 2.32 1.07 2.88.82.09-.65.34-1.08.62-1.33-2.17-.25-4.45-1.08-4.45-4.82 0-1.07.38-1.95 1.03-2.64-.1-.25-.45-1.3.1-2.72 0 0 .86-.27 2.8 1.05A9.5 9.5 0 0110 4.14c.85.03 1.7.11 2.5.31 1.95-1.33 2.8-1.05 2.8-1.05.55 1.42.2 2.47.1 2.72.64.69 1.03 1.57 1.03 2.64 0 3.75-2.28 4.57-4.46 4.81.35.3.67.9.67 1.82l-.01 2.7c0 .27.18.58.69.48A10 10 0 0010 0z"
      />
    </svg>
  );

  return (
    <main className="h-full w-full flex flex-col items-center justify-center">
      <div className="flex flex-col p-16 border rounded-3xl gap-y-6">
        <h1 className="text-4xl">Login</h1>
        <div className="flex flex-row p-4 border rounded-3xl">
          {githubSVG}
          <button className="" onClick={() => signIn("github")}>
            GitHub
          </button>
        </div>
      </div>
    </main>
  );
}
