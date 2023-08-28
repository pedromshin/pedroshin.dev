"use client";
import { ReactNode } from "react";

export default ({
  children,
  title,
  description,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-start p-12 pb-0 lg:items-start">
      <div className="mb-8 md:mb-10">
        <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">{title}</h1>
        <p className="text-base md:text-xl opacity-60">{description}</p>
      </div>
      {children}
    </div>
  );
};
