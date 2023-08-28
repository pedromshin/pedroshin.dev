"use client";
import StreamingWords from "@App/components/atoms/StreamingWords";
import envs from "@App/envs";
import PageChatbot from "@Components/templates/PageChatbot";
import { Spinner } from "@material-tailwind/react";
import { useState } from "react";

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const [messages, setMessages] = useState<
    { side: "query" | "response"; content: string }[]
  >([]);

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

  const handleChat = async () => {
    setQuery("");
    setLoading(true);

    setMessages((prev) => [...(prev || []), { side: "query", content: query }]);

    const answerResponse = await fetch("/api/projects/chatbot/open", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        apiKey: envs.OPEN_AI_KEY,
      }),
    });

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
  };

  return (
    <PageChatbot
      title="Open Chatbot"
      description="ChatGPT gpt-3.5-turbo model with no fine-tuning."
      input={query}
      handleInputChange={(e) => setQuery(e.target.value)}
      handleSubmit={handleChat}
    >
      <div className="flex flex-col gap-4 w-full mt-8 pb-[85px] px-[12px]">
        {renderMessages()}
        {loading && (
          <div className="border border-zinc-600 rounded-lg p-4 w-fit max-w-[80%]">
            <Spinner />
          </div>
        )}
      </div>
    </PageChatbot>
  );
};
