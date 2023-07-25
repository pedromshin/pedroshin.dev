import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const items = [
    {
      title: "OCR",
      link: "/ocr",
    },
    {
      title: "Extract subtitle from video and transcribe audio",
      link: "/subtitle",
    },
    {
      title: "Chatbot",
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
    {
      title: "Image generate",
      link: "/image",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col justify-between p-4">
      <div className="mb-32 lg:mb-0  lg:text-left">
        {items.map((item) => (
          <a
            key={item.title}
            href={item.link}
            className="flex group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
              {item.title}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
          </a>
        ))}
      </div>
    </main>
  );
}
