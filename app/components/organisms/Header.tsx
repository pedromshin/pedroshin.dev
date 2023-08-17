"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { links } from "@App/links";
import RecursiveDropdown from "@App/components/molecules/RecursiveDropdown";
import { useState } from "react";
import LinksDrawer from "./LinksDrawer";
import { IconMenuDeep } from "@tabler/icons-react";

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex flex-row justify-between items-center gap-y-6 p-4 border-b-2 md:flex-row md:justify-between md:align-center">
        <h1 className="text-2xl font-bold">
          <Link href={"/"}>pedroshin.dev</Link>
        </h1>
        <button onClick={() => setOpen(true)}>
          <IconMenuDeep />
        </button>
        {/* <nav className="w-full md:w-fit flex-row align-center gap-x-4 overflow-scroll hidden lg:flex">
          <RecursiveDropdown links={links} />
        </nav> */}
        {/* <div>
          <a href="/private" target="_blank" className="mr-4">
            Private
          </a>
          <button onClick={() => signOut()}>Signout</button>
        </div> */}
      </header>
      <LinksDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};
