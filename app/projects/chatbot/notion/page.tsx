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
import endent from "endent";
import StreamingWords from "@App/components/atoms/StreamingWords";

export default () => {
  const [openConfig, setOpenConfig] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [scraping, setScraping] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<
    { side: "query" | "response"; content: string }[]
  >([]);
  const [chunks, setChunks] =
    useState<({ similarity: number } & ChunkType)[]>();
  const [mode, setMode] = useState<"search" | "chat">("chat");
  const [systemPrompt, setSystemPrompt] = useState<string>(
    "You are being used as a chatbot for company Flash Beneficios, the corporate perks company based in Sao Paulo, Brazil. If the user's question is innapropriate on a corporate environment, politely refuse to answer."
  );

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
    setQuery("");
    setChunks([]);
    setLoading(true);

    setMessages((prev) => [...(prev || []), { side: "query", content: query }]);
    const search = await fetch("/api/projects/chatbot/notion/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, apiKey: envs.OPEN_AI_KEY }),
    }).then(async (res) => await res.json());

    setChunks(search);

    if (mode === "chat") {
      const prompt = endent`
      Use the following passages to provide an answer to the query "${query}":
  
      ${search?.map((d: any) => d.content).join("\n\n")}
      `;

      const answerResponse = await fetch(
        "/api/projects/chatbot/notion/answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            apiKey: envs.OPEN_AI_KEY,
            systemPrompt,
          }),
        }
      );

      setLoading(false);

      const data = answerResponse.body;

      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        setMessages((prev) => {
          const newArray = [...prev];
          const lastItem = newArray[newArray.length - 1];

          if (lastItem && lastItem.side === "response") {
            lastItem.content += chunkValue;
          } else {
            newArray.push({ side: "response", content: chunkValue });
          }

          return newArray;
        });
      }
    }
  };

  const renderMessages = () => {
    return messages?.map((message, index) => {
      if (message.side === "query") {
        return (
          <div
            key={index}
            className="border border-zinc-600 rounded-lg p-4 ml-auto"
          >
            <div className="">{message.content}</div>
          </div>
        );
      }
      if (message.side === "response") {
        return (
          <div
            key={index}
            className="border border-zinc-600 rounded-lg p-4 w-fit max-w-[80%]"
          >
            <StreamingWords text={message.content} />
          </div>
        );
      }
    });
  };

  return (
    <PageChatbot
      input={query}
      handleInputChange={(e) => setQuery(e.target.value)}
      handleSubmit={handleChat}
    >
      <Accordion open={openConfig} className="pt-12 px-12">
        <AccordionHeader
          onClick={() => setOpenConfig((prev) => !prev)}
          className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-white hover:text-white justify-between [&>span]:hidden"
        >
          {/* <h1>{openConfig ? "Close" : "Open"} configurations</h1> */}
          <h1>Customized Chatbot</h1>
          <IconArrowDown />
        </AccordionHeader>
        <AccordionBody>
          <div className="flex flex-col gap-8 w-full mt-2">
            <p className="text-base md:text-xl text-white hover:text-white ">
              Train chatbot with data from custom Notion page and either SEARCH
              for most similar chunks OR CHAT with model fine-tuned by texts.
            </p>
            <Input
              placeholder="Insert system prompt:"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
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
                    Generate word embeddings from Notion page and update vector
                    database
                  </h1>
                  <IconRotate />
                </>
              )}
            </Button>
            <Select
              label="Select mode"
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
      <div className="flex flex-row gap-4 w-full overflow-x-scroll pl-12 no-scrollbar mt-8">
        <div className="flex flex-col gap-4 w-full min-w-fit md:min-w-none md:max-w-fit">
          <ExternalLink
            label="Edit content on Notion page"
            href="https://solar-fox-a61.notion.site/Flash-dataset-chatbot-90ae074d502a41be99096e6585838941"
          />
        </div>
        <div className="flex flex-col gap-4 w-full min-w-fit md:min-w-none md:max-w-fit">
          <ExternalLink
            label="Visualize 3D relational positions of embeddings"
            href="/projects/embeddings"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full mt-8 pb-[85px] px-[12px]">
        {renderMessages()}
        {loading && (
          <div className="border border-zinc-600 rounded-lg p-4 w-fit max-w-[80%]">
            <Spinner />
          </div>
        )}
        {chunks &&
          mode === "search" &&
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
