import { Client } from "@notionhq/client";
import { loadEnvConfig } from "@next/env";

import fs from "fs";

loadEnvConfig("");

const findPlainTextValues = (data: any) => {
  const plainTextValues: string[] = [];

  function extractPlainText(obj: any) {
    if (typeof obj === "object" && obj !== null) {
      if (obj.hasOwnProperty("plain_text")) {
        plainTextValues.push(obj.plain_text);
      } else {
        for (const key in obj) {
          extractPlainText(obj[key]);
        }
      }
    }
  }

  data.forEach((item: any) => {
    extractPlainText(item);
  });

  return plainTextValues;
};

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

    const plainTextValues = findPlainTextValues(response.results);
    console.log("plainTextValues", plainTextValues);

    fs.writeFileSync(
      "scripts/embeddings-notion/processed-notion.json",
      JSON.stringify(plainTextValues)
    );
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
})();
