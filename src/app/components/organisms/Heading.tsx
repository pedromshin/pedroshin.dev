"use client";

export default ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col items-center justify-start h-full p-12 lg:items-start">
      <h1 className="text-4xl font-bold">{title}</h1>
    </div>
  );
};
