"use client";
import Link from "next/link";
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
      </header>
      <LinksDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};
