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

    const texts = findTexts(results);
    const encodedTexts: EncodedTextType[] = encodeText(texts);

    const currentUrl = envs.DEV ? envs.DEV_URL : envs.PROD_URL;

    try {
      await Promise.allSettled(
        encodedTexts.map(async (section) => {
          await Promise.allSettled(
            section.chunks.map(async (chunk) => {
              await fetch(`${currentUrl}/api/projects/chatbot/notion/embed`, {
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ text: chunk }),
              });
            })
          );
        })
      );
    } catch {}

    return NextResponse.json(encodedTexts);
  } catch {
    return null;
  }
}
