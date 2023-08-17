"use client";
import { signOut } from "next-auth/react";

import { Drawer } from "@material-tailwind/react";
import RecursiveDropdown from "../molecules/RecursiveDropdown";
import { links } from "@App/links";

export default ({ onClose, open }: { onClose: () => void; open: boolean }) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={0.6 * window.innerWidth}
      className="p-4 bg-black bg-opacity-50 border-l-2 border-white-700/50"
      placement="right"
    >
      <div className="mb-6 h-full flex flex-col items-center justify-between">
        <nav className="w-full md:w-fit flex-col align-center gap-x-4 overflow-scroll">
          <RecursiveDropdown links={links} />
        </nav>
        <div>
          <a href="/private" target="_blank" className="mr-4">
            Private
          </a>
          <button onClick={() => signOut()}>Signout</button>
        </div>
      </div>
    </Drawer>
  );
};
