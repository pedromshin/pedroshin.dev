import { PageContainer } from "@/components/PageContainer";

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
          className="flex group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold text-white">
            {item.title}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none text-white">
              -&gt;
            </span>
          </h2>
        </a>
      ))}
    </PageContainer>
  );
};
