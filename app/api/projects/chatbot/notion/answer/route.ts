import { OpenAIStream } from "./embeddings";

export const config = {
  runtime: "edge",
};

export async function POST(req: Request): Promise<Response> {
  try {
    const { prompt, apiKey, systemPrompt } = (await req.json()) as {
      prompt: string;
      apiKey: string;
      systemPrompt: string;
    };

    const stream = await OpenAIStream(prompt, apiKey, systemPrompt);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
