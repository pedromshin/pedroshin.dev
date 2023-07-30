import { Client } from "@notionhq/client";
import { loadEnvConfig } from "@next/env";
import { encode } from "gpt-3-encoder";

loadEnvConfig("");

const CHUNK_SIZE = 200;

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

const getTextData = (rawText: string[]) => {
  let data: any[] = [];

  rawText.forEach((item: string) => {
    let text = {
      content: "",
      length: 0,
      tokens: 0,
      chunks: [],
    };

    const trimmedContent = item.trim();

    text = {
      content: trimmedContent,
      length: trimmedContent.length,
      tokens: encode(trimmedContent).length,
      chunks: [],
    };

    data.push(text);
  });

  return data;
};

const chunkTextData = (data: any[]) => {
  let result: any[] = [];

  data.forEach((item: any) => {
    const { content } = item;

    let essayTextChunks = [];

    if (encode(content).length > CHUNK_SIZE) {
      const split = content.split(". ");
      let chunkText = "";

      for (let i = 0; i < split.length; i++) {
        const sentence = split[i];
        const sentenceTokenLength = encode(sentence);
        const chunkTextTokenLength = encode(chunkText).length;

        if (chunkTextTokenLength + sentenceTokenLength.length > CHUNK_SIZE) {
          essayTextChunks.push(chunkText);
          chunkText = "";
        }

        if (sentence[sentence.length - 1].match(/[a-z0-9]/i)) {
          chunkText += sentence + ". ";
        } else {
          chunkText += sentence + " ";
        }
      }

      essayTextChunks.push(chunkText.trim());
    } else {
      essayTextChunks.push(content.trim());
    }

    const essayChunks = essayTextChunks.map((text) => {
      const trimmedText = text.trim();

      const chunk = {
        content: trimmedText,
        content_length: trimmedText.length,
        content_tokens: encode(trimmedText).length,
        embedding: [],
      };

      return chunk;
    });

    if (essayChunks.length > 1) {
      for (let i = 0; i < essayChunks.length; i++) {
        const chunk = essayChunks[i];
        const prevChunk = essayChunks[i - 1];

        if (chunk.content_tokens < 100 && prevChunk) {
          prevChunk.content += " " + chunk.content;
          prevChunk.content_length += chunk.content_length;
          prevChunk.content_tokens += chunk.content_tokens;
          essayChunks.splice(i, 1);
          i--;
        }
      }
    }

    const chunkedSection = {
      ...item,
      chunks: essayChunks,
    };

    result.push(chunkedSection);
  });

  return result;
};

const scrape = async (req: any, res: any): Promise<Response> => {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  try {
    const page_id = "90ae074d-502a-41be-9909-6e6585838941";

    const response = await notion.blocks.children.list({
      block_id: page_id,
      page_size: 50,
    });

    const plainTextValues = findPlainTextValues(response.results);
    const textData = getTextData(plainTextValues);
    const chunkedTextData = chunkTextData(textData);

    return res.status(200).json(chunkedTextData);
  } catch (error) {
    return new Response("Error", { status: 500 });
  }
};

export default scrape;
