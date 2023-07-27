import fs from "fs";
import { loadEnvConfig } from "@next/env";
import { Configuration, OpenAIApi } from "openai";
import { createClient } from "@supabase/supabase-js";

loadEnvConfig("");

type Chunk = {
  content: string;
  content_length: number;
  content_tokens: number;
  embedding: number[];
};

type ChunkedText = {
  content: string;
  length: number;
  tokens: number;
  chunks: Chunk[];
};

const generateEmbeddings = async (texts: ChunkedText[]) => {
  const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  for (let i = 0; i < texts.length; i++) {
    const section = texts[i];

    for (let j = 0; j < section.chunks.length; j++) {
      const chunk = section.chunks[j];

      const { content, content_length, content_tokens } = chunk;

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

      if (error) {
        console.log("error", error);
      } else {
        console.log(
          "sucessfully saved embedding of " +
            `section ${j + 1}/${section.chunks.length} of`,
          `chunk ${i + 1}/${texts.length}`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
};

(async () => {
  const texts = JSON.parse(
    fs.readFileSync("scripts/embeddings-notion/processed-notion.json", "utf8")
  );

  await generateEmbeddings(texts);
})();
