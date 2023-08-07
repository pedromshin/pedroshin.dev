"use client";

import { ReactNode } from "react";

export default ({
  children,
  title,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-start p-12 lg:items-start">
      <div className="mb-24">
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>
      {children}
    </div>
  );
};
