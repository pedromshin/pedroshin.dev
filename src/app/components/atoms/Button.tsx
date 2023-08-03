import { ReactNode } from "react";

export default ({
  callback,
  children,
}: {
  callback: () => void;
  children: ReactNode;
}) => {
  return (
    <button className="flex flex-row p-4 border rounded-3xl" onClick={callback}>
      {children}
    </button>
  );
};
