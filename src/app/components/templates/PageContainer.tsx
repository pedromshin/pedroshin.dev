import { ReactNode } from "react";
import Header from "../molecules/Header";

export default ({ children }: { children: ReactNode }) => {
  return (
    <main className="h-full">
      <Header />
      {children}
    </main>
  );
};
