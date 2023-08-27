import { NextResponse } from "next/server";
import SupabaseClient from "@Clients/supabase-client";

export async function GET(req: Request) {
  try {
    const embeddings = await SupabaseClient.from("notion_embeddings").select(
      "embedding, content"
    );

    return NextResponse.json({ status: "success", data: embeddings });
  } catch {
    return NextResponse.json({ status: "error fetching embeddings" });
  }
}
