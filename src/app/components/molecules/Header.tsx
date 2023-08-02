import Link from "next/link";

export default () => {
  return (
    <header className="flex flex-row p-4 border-b-2">
      <h1 className="text-2xl font-bold">
        <Link href={"/home"}>pedroshin.dev</Link>
      </h1>
    </header>
  );
};
