import NotionClient from "@App/clients/notion-client";
import { NextResponse } from "next/server";
import findTexts from "./findTexts";

export async function GET() {
  const page_id = "90ae074d-502a-41be-9909-6e6585838941";

  try {
    const { results } = await NotionClient.blocks.children.list({
      block_id: page_id,
      page_size: 50,
    });

    const texts = findTexts(results);

    return NextResponse.json(texts);
  } catch {
    return null;
  }
}
