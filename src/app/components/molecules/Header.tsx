import Link from "next/link";
import Button from "../atoms/Button";
import { signOut } from "next-auth/react";
import { links } from "@Src/app/links";

export default () => {
  return (
    <header className="flex flex-row p-4 border-b-2 justify-between align-center">
      <h1 className="text-2xl font-bold mr-[-150px]">
        <Link href={"/home"}>pedroshin.dev</Link>
      </h1>
      <nav className="flex flex-row align-center gap-x-4">
        {links.map((item, i) => (
          <Link key={i} href={item.link}>
            {item.title}
          </Link>
        ))}
      </nav>
      <button onClick={() => signOut()}>Signout</button>
    </header>
  );
};
