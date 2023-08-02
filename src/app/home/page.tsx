"use client";
import PageContainer from "@Components/templates/PageContainer";
import { links } from "../links";

export default function Page() {
  const buttons = links.map((item, i) => (
    <a
      key={i}
      className="h-[150px] w-[300px] border rounded-3xl p-8 hover:bg-zinc-900"
      href={item.link}
    >
      <h1 className="text-1xl font-bold">{item.title}</h1>
    </a>
  ));

  return (
    <PageContainer>
      <div className="flex flex-row flex-wrap justify-around p-24 gap-x-4 gap-y-8">
        {buttons}
      </div>
    </PageContainer>
  );
}
