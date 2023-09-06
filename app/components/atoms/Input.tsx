import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export default ({
  label,
  ...props
}: { label?: string } & DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label htmlFor="input">{label}</label>}
      <input
        id={"input"}
        className="w-full flex flex-row p-4 border rounded-3xl h-fit bg-transparent outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white hover:text-white"
        {...props}
      />
    </div>
  );
};
