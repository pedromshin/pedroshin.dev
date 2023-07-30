import { signOut } from "next-auth/react";
import { ReactNode } from "react";

export const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="flex flex-col flex-grow max-w-md w-full bg-black rounded-md shadow-md">
        {children}
      </div>
      <button
        className="flex items-center justify-center bg-black text-white border border-white px-4 py-3 rounded-md hover:bg-white hover:text-black focus:outline-none mt-4 p-4"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </>
  );
};
