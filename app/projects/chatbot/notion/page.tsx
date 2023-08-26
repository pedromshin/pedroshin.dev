"use client";
import PageChatbot from "@Components/templates/PageChatbot";
import Input from "@Components/atoms/Input";
import Button from "@Components/atoms/Button";
import ExternalLink from "@Components/atoms/ExternalLink";
import { IconArrowDown, IconRotate } from "@tabler/icons-react";
import SupabaseClient from "@Clients/supabase-client";
import { ChunkType } from "@App/api/projects/chatbot/notion/scrape/route";
import { useState } from "react";
import envs from "@Envs";
import {
  Option,
  Spinner,
  Select,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

export default () => {
  const [openConfig, setOpenConfig] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [scraping, setScraping] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [sentQueries, setSentQuery] = useState<string[]>();
  const [chunks, setChunks] =
    useState<({ similarity: number } & ChunkType)[]>();
  const [answer, setAnswer] = useState<string>("");
  const [mode, setMode] = useState<"search" | "chat">("search");

  const handleGenerate = async () => {
    setScraping(true);
    try {
      await SupabaseClient.from("notion_embeddings").delete().neq("content", 0);
    } catch {}

    try {
      await fetch("/api/projects/chatbot/notion/scrape", {
        method: "GET",
      });
    } catch {}

    setScraping(false);
  };

  const handleChat = async () => {
    setAnswer("");
    setChunks([]);
    setLoading(true);

    if (mode === "search") {
      setSentQuery((prev) => [...(prev || []), query]);
      const search = await fetch("/api/projects/chatbot/notion/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, apiKey: envs.OPEN_AI_KEY }),
      }).then(async (res) => await res.json());

      setChunks(search);

      console.log(search);
    }

    if (mode === "chat") {
    }

    setLoading(false);
  };

  return (
    <PageChatbot
      input={query}
      title="Customized Chatbot"
      description=""
      handleInputChange={(e) => setQuery(e.target.value)}
      handleSubmit={handleChat}
      configurations={
        <Accordion open={openConfig}>
          <AccordionHeader
            onClick={() => setOpenConfig((prev) => !prev)}
            className="text-white hover:text-white justify-between [&>span]:hidden"
          >
            <h1>{openConfig ? "Close" : "Open"} configurations</h1>
            <IconArrowDown />
          </AccordionHeader>
          <AccordionBody>
            <div className="flex flex-col gap-8 w-full mt-2">
              <Input placeholder="Insert system prompt:" />
              <ExternalLink
                label="Edit content on Notion page!"
                href="https://solar-fox-a61.notion.site/Flash-dataset-chatbot-90ae074d502a41be99096e6585838941"
              />
              <Button onClick={handleGenerate} disabled={scraping}>
                {scraping ? (
                  <>
                    <h1>Scraping...</h1>
                    <Spinner />
                  </>
                ) : (
                  <>
                    <h1>
                      Generate word embeddings from Notion page and update
                      vector database
                    </h1>
                    <IconRotate />
                  </>
                )}
              </Button>
              <Select
                label="Select mode"
                variant="standard"
                color="gray"
                value={mode}
                onChange={(value) => setMode(value as "search" | "chat")}
                size="lg"
              >
                <Option value="search" className="text-white hover:text-white">
                  Search database for most similar chunks
                </Option>
                <Option value="chat" className="text-white hover:text-white">
                  Chat with model fine-tuned by texts
                </Option>
              </Select>
            </div>
          </AccordionBody>
        </Accordion>
      }
    >
      <div className="flex flex-col gap-4 w-full h-full">
        {chunks &&
          sentQueries?.map((query, index) => {
            return (
              <div
                key="index"
                className="border border-zinc-600 rounded-lg p-4 ml-auto"
              >
                <div className="">{query}</div>
              </div>
            );
          })}
        {loading && <Spinner />}
        {chunks &&
          chunks?.map((chunk, index) => (
            <div
              key={index}
              className="border border-zinc-600 rounded-lg p-4 w-fit max-w-[80%]"
            >
              <div>{chunk.content}</div>
              <div>Match: {(chunk.similarity * 100).toFixed(2)}%</div>
            </div>
          ))}
      </div>
    </PageChatbot>
  );
};
