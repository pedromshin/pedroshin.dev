import fs from "fs";
import { loadEnvConfig } from "@next/env";
import { Configuration, OpenAIApi } from "openai";
import { createClient } from "@supabase/supabase-js";

loadEnvConfig("");

const generateEmbeddings = async (texts: any) => {
  const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};

(async () => {
  const texts = JSON.parse(
    fs.readFileSync("scripts/embeddings-notion/processed-notion.json", "utf8")
  );

  await generateEmbeddings(texts);
})();
