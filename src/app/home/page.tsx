"use client";
import { signOut } from "next-auth/react";
import PageContainer from "@Components/templates/PageContainer";
import Button from "../components/atoms/Button";

export default function Page() {
  const items = [
    {
      title: "OCR",
      link: "/ocr",
    },
    {
      title: "Extração de dados padronizados de currículo",
      link: "/curriculo",
    },
    {
      title: "Extract subtitle from video and transcribe audio",
      link: "/subtitle",
    },
    {
      title: "Image generate",
      link: "/image",
    },
    {
      title: "Chatbot open",
      link: "/chatbot",
    },
    {
      title: "Chatbot with Paul Graham's Essay embeddings",
      link: "/embeddings-pg",
    },
    {
      title: "Chatbot with custom created data on notion page",
      link: "/embeddings-notion",
    },
  ];

  const buttons = items.map((item, i) => (
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
