import OpenAIClient from "@App/clients/openai-client";
import SupabaseClient from "@App/clients/supabase-client";
import { NextResponse } from "next/server";
import { ChunkType } from "../scrape/route";

const generateEmbeddings = async (text: ChunkType) => {
  const { content, content_length, content_tokens } = text;

  const embeddings = await OpenAIClient.createEmbedding({
    model: "text-embedding-ada-002",
    input: content,
  }).then(async (res) => await res.json());

  await SupabaseClient.from("notion_embeddings")
    .insert({
      content,
      content_tokens,
      content_length,
      embedding: embeddings.data[0].embedding,
    })
    .select("*");
};

export async function POST(req: Request) {
  const { text } = await req.json();

  try {
    await generateEmbeddings(text);
    return NextResponse.json({ status: "success generating embeddings" });
  } catch {
    return NextResponse.json({ status: "error generating embeddings" });
  }
}
