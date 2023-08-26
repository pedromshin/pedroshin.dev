"use client";
import openaiClient from "@App/clients/openai-client";
import Button from "@App/components/atoms/Button";
import Input from "@App/components/atoms/Input";
import Heading from "@Components/organisms/Heading";
import { Spinner } from "@material-tailwind/react";
import Image from "next/image";
import { useState } from "react";

export default () => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
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

    if (image) setResult(image);
  };

  return (
    <>
      <Heading
        title={"Image generation"}
        description="Write prompts to generate images using OpenAI's DALL-E image generation model"
      >
        <div className="flex flex-col gap-4 w-full">
          <form onSubmit={generateImage} className="w-full">
            <Input
              value={prompt}
              placeholder="Write a prompt to generate an image:"
              onChange={(e) => setPrompt(e.target.value)}
              className="min-w-[333px] flex flex-row p-4 border rounded-3xl h-fit bg-transparent outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white hover:text-white"
            />
          </form>
          {prompt && (
            <Button onClick={generateImage} disabled={!prompt}>
              Generate
            </Button>
          )}
        </div>
        <>
          {!loading ? (
            result.length > 0 ? (
              <Image
                layout="responsive"
                className="result-image"
                src={result}
                alt="result"
                width={width}
                height={height}
              />
            ) : (
              <></>
            )
          ) : (
            <Spinner />
          )}
        </>
      </Heading>
    </>
  );
};
