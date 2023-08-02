import Link from "next/link";
import Button from "../atoms/Button";
import { signOut } from "next-auth/react";

export default () => {
  return (
    <header className="flex flex-row p-4 border-b-2 justify-between align-center">
      <h1 className="text-2xl font-bold">
        <Link href={"/home"}>pedroshin.dev</Link>
      </h1>
      <nav className="flex flex-row align-center">
        <Link href={"/home"}>Home</Link>
      </nav>
      <button onClick={() => signOut()}>Signout</button>
    </header>
  );
};
