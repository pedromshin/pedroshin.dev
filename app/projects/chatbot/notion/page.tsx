"use client";
import PageChatbot from "@App/components/templates/PageChatbot";
import { useChat } from "ai/react";
import Input from "@App/components/atoms/Input";
import Button from "@App/components/atoms/Button";
import ExternalLink from "@App/components/atoms/ExternalLink";
import { IconRotate } from "@tabler/icons-react";
import SupabaseClient from "@App/clients/supabase-client";
import { EncodedTextType } from "@App/api/projects/chatbot/notion/scrape/route";
import { useState } from "react";

export default () => {
  const [scraping, setScraping] = useState<boolean>(false);
  const [scrapeProgress, setScrapeProgress] = useState<string[]>();

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  const handleGenerate = async () => {
    setScraping(true);
    setScrapeProgress(["Starting to scrape Notion page..."]);
    try {
      await SupabaseClient.from("notion_embeddings").delete().neq("content", 0);
    } catch {}

    try {
      const scrape: EncodedTextType[] = await fetch(
        "/api/projects/chatbot/notion/scrape",
        {
          method: "GET",
        }
      ).then((res) => res.json());

      try {
        scrape.map((section, i) => {
          section.chunks.map(async (chunk, j) => {
            await fetch("/api/projects/chatbot/notion/embed", {
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({ text: chunk }),
            });

            setScrapeProgress((prev) => [
              ...(prev ?? [""]),
              `Successfully saved embedding of section ${j + 1}/${
                section.chunks.length
              } of chunk ${i + 1}/${scrape.length}`,
            ]);
          });
        });
      } catch {}
    } catch {}

    setScraping(false);
  };

  return (
    <PageChatbot
      input={input}
      title="Customized Chatbot"
      description=""
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4 w-full">
        <Input placeholder="Insert system prompt:" />
        <ExternalLink
          label="Edit content on Notion page!"
          href="https://solar-fox-a61.notion.site/Flash-dataset-chatbot-90ae074d502a41be99096e6585838941"
        />
        <Button onClick={handleGenerate} disabled={scraping}>
          {scraping
            ? "Scraping..."
            : "Generate word embeddings from Notion page and update vector database"}
          <IconRotate />
        </Button>
        <div className="flex flex-row gap-4">
          {scrapeProgress && (
            <div className="mt-4 border border-zinc-600 rounded-lg p-4 max-h-[400px] overflow-y-auto">
              <div className="font-bold text-2sm mb-2">Scraping progress:</div>
              {scrapeProgress.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
          )}
          {scrapeProgress && (
            <Button onClick={() => setScrapeProgress(undefined)}>
              Clear scrape progress
            </Button>
          )}
        </div>
      </div>
      <></>
    </PageChatbot>
  );
};
