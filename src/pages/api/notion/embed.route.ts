import fs from "fs";
import { loadEnvConfig } from "@next/env";
import { Configuration, OpenAIApi } from "openai";
import { createClient } from "@supabase/supabase-js";

loadEnvConfig("");

export type Chunk = {
  content: string;
  content_length: number;
  content_tokens: number;
  embedding: number[];
};

export type ChunkedText = {
  content: string;
  length: number;
  tokens: number;
  chunks: Chunk[];
};

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const generateEmbeddings = async (text: Chunk) => {
  const { content, content_length, content_tokens } = text;

  console.log(text);

  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: content,
  });

  const [{ embedding }] = embeddingResponse.data.data;

  const { data, error } = await supabase
    .from("notion_embeddings")
    .insert({
      content,
      content_tokens,
      content_length,
      embedding,
    })
    .select("*");

  await new Promise((resolve) => setTimeout(resolve, 200));
};

const embed = async (req: Request, res: any) => {
  try {
    const { text } = JSON.parse(JSON.stringify(req.body));
    await generateEmbeddings(text);

    return res.status(200).json({ message: "Embeddings generated" });
  } catch {
    return res.status(500).json({ error: "error" });
  }
};

export default embed;
