import { signOut } from "next-auth/react";
import { ReactNode } from "react";

export const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col items-left justify-left min-h-screen bg-black p-4">
      <div className="flex-grow max-w-md w-full bg-black rounded-md shadow-md">
        {children}
      </div>
      <button
        className="flex items-center justify-center bg-black text-white border border-white px-4 py-3 rounded-md hover:bg-white hover:text-black focus:outline-none"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </main>
  );
};
