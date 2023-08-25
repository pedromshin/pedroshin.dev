import NotionClient from "@App/clients/notion-client";
import { NextResponse } from "next/server";

import findTexts from "./findTexts";
import { encodeText } from "./encodeTexts";

const NOTION_PAGE_ID = "90ae074d-502a-41be-9909-6e6585838941";

type EncodedTextType = {
  content: string;
  length: number;
  tokens: number;
  chunks: {
    content: string;
    content_length: number;
    content_tokens: number;
    embedding: number[];
  }[];
};

export async function GET() {
  try {
    const { results } = await NotionClient.blocks.children.list({
      block_id: NOTION_PAGE_ID,
      page_size: 50,
    });

    const texts = findTexts(results);
    const encodedTexts: EncodedTextType[] = encodeText(texts);

    return NextResponse.json(encodedTexts);
  } catch {
    return null;
  }
}
