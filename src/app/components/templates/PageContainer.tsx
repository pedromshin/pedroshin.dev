import { ReactNode } from "react";
import Header from "../molecules/Header";

export default ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
};
