import { Client } from "@notionhq/client";
import { loadEnvConfig } from "@next/env";

import fs from "fs";

loadEnvConfig("");

(async () => {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  try {
    const page_id = "90ae074d-502a-41be-9909-6e6585838941";

    const response = await notion.blocks.children.list({
      block_id: page_id,
      page_size: 50,
    });

    fs.writeFileSync(
      "scripts/embeddings-notion/raw-notion.json",
      JSON.stringify(response)
    );
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
})();
