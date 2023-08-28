import { IconExternalLink } from "@tabler/icons-react";
import Link from "next/link";

export default ({ href, label }: { href: string; label: string }) => {
  return (
    <Link href={href} target="_blank" className="w-full min-w-fit">
      <button
        className={
          "flex flex-row p-3 border justify-between rounded-3xl h-fit bg-transparent w-full items-center gap-1 text-sm text-start text-white hover:text-white max-h-[48px]"
        }
      >
        <h1>{label}</h1>
        <IconExternalLink size={20} />
      </button>
    </Link>
  );
};
