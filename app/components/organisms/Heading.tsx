"use client";

import { ReactNode } from "react";

export default ({
  children,
  title,
  description,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-start p-12 lg:items-start">
      <div className="mb-24">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-xl opacity-60">{description}</p>
      </div>
      {children}
    </div>
  );
};
