import NotionClient from "@Clients/notion-client";
import { NextResponse } from "next/server";

import findTexts from "./findTexts";
import { encodeText } from "./encodeTexts";
import envs from "@Envs";

const NOTION_PAGE_ID = "90ae074d-502a-41be-9909-6e6585838941";

export type ChunkType = {
  content: string;
  content_length: number;
  content_tokens: number;
  embedding: number[];
};

export type EncodedTextType = {
  content: string;
  length: number;
  tokens: number;
  chunks: ChunkType[];
};

export async function GET() {
  try {
    const { results } = await NotionClient.blocks.children.list({
      block_id: NOTION_PAGE_ID,
      page_size: 50,
    });
    const currentUrl = envs.DEV ? envs.DEV_URL : envs.PROD_URL;

    const texts = findTexts(results);
    const encodedTexts = await Promise.all(
      encodeText(texts).map(async (section) => {
        const embeddings = await Promise.all(
          section.chunks.map(async (chunk) => {
            const embed = await fetch(
              `${currentUrl}/api/projects/chatbot/notion/embed`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ text: chunk }),
              }
            );

            const { embedding } = await embed.json();
            return embedding;
          })
        );

        return { ...section, embedding: embeddings[0] };
      })
    );

    return NextResponse.json(encodedTexts);
  } catch {
    return null;
  }
}
