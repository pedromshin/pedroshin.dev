import { NextApiRequest, NextApiResponse } from "next";

import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export const config = {
  runtime: "edge",
};

const handler = async () => {
  try {
    const page_id = "90ae074d-502a-41be-9909-6e6585838941";

    const response = await notion.blocks.children.list({
      block_id: page_id,
      page_size: 50,
    });

    return response;
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
