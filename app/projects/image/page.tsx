"use client";
import openaiClient from "@App/clients/openai-client";
import Button from "@App/components/atoms/Button";
import ChatInput from "@App/components/atoms/ChatInput";
import Input from "@App/components/atoms/Input";
import Heading from "@Components/organisms/Heading";
import { Spinner } from "@material-tailwind/react";
import Image from "next/image";
import { useState } from "react";

export default () => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<
    { side: "query" | "response"; content: string }[]
  >([]);
  const width = 512;
  const height = 512;

  const generateImage = async () => {
    setLoading(true);
    const res = await openaiClient
      .createImage({
        prompt: prompt,
        n: 1,
        size: `${width}x${height}`,
      })
      .then(async (res) => await res.json());

    setLoading(false);

    const image = res?.data?.[0]?.url;

    return image;
  };

  const handleChat = async () => {
    if (!prompt) return;
    setPrompt("");
    setLoading(true);

    setMessages((prev) => [
      ...(prev || []),
      { side: "query", content: prompt },
    ]);

    const image = await generateImage();

    setMessages((prev) => [
      ...(prev || []),
      { side: "response", content: image },
    ]);
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
          <div key={index} className="mr-auto">
            {message.content ? (
              <Image
                layout="responsive"
                className="result-image"
                src={message.content}
                alt="result"
                width={width}
                height={height}
              />
            ) : (
              <Button
                onClick={() => {
                  handleChat();
                }}
              >
                An error ocurred. Click here to try again
              </Button>
            )}
          </div>
        );
      }
    });
  };

  return (
    <>
      <Heading
        title={"Image generation"}
        description="Write prompts to generate images using OpenAI's DALL-E image generation model"
      >
        <div className="flex flex-col gap-4 w-full mt-8 pb-[85px] px-[12px]">
          {renderMessages()}
          {loading && (
            <div className="border border-zinc-600 rounded-lg p-4 w-fit max-w-[80%] mr-auto">
              <Spinner />
            </div>
          )}
        </div>
      </Heading>
      <ChatInput
        onChange={(e) => setPrompt(e.target.value)}
        onSubmit={handleChat}
        placeholder="Write a prompt to generate an image:"
        value={prompt}
      />
    </>
  );
};
