"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { links } from "@Src/app/links";
import RecursiveDropdown from "@Src/app/components/molecules/RecursiveDropdown";

export default () => {
  return (
    <header className="flex flex-col justify-center items-center gap-y-6 p-4 border-b-2  md:flex-row md:justify-between md:align-center">
      <h1 className="text-2xl font-bold">
        <Link href={"/home"}>pedroshin.dev</Link>
      </h1>
      <nav className="w-full md:w-fit flex flex-row align-center gap-x-4 overflow-scroll">
        <RecursiveDropdown links={links} />
      </nav>
      <div>
        <a href="/private" target="_blank" className="mr-4">
          Private
        </a>
        <button onClick={() => signOut()}>Signout</button>
      </div>
    </header>
  );
};
