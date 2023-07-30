import { PageContainer } from "@/components/PageContainer";
import { IconExternalLink } from "@tabler/icons-react";

export const PageMain = () => {
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

  return (
    <PageContainer>
      {items.map((item) => (
        <a
          key={item.title}
          href={item.link}
          className="flex flex-row items-center rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 p-4 mt-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
          <span className="ml-2 text-2xl font-semibold text-white">
            <IconExternalLink />
          </span>
        </a>
      ))}
    </PageContainer>
  );
};
