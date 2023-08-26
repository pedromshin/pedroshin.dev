import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export default ({
  ...props
}: DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  return (
    <input
      className="flex flex-row p-4 border rounded-3xl h-fit bg-transparent outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white hover:text-white"
      {...props}
    />
  );
};
