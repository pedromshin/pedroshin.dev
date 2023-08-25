import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

export default ({
  children,
  ...props
}: { children: ReactNode } & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button
      className="flex flex-row p-4 border rounded-3xl h-fit gap-2"
      {...props}
    >
      {children}
    </button>
  );
};
