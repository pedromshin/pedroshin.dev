import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

const OPEN_AI_KEY = process.env.OPEN_AI_KEY;

const config = new Configuration({
  apiKey: OPEN_AI_KEY,
});

const openAI = new OpenAIApi(config);

export const runtime = "edge";

export default async function POST(req: any) {
  const { messages } = await req.json();

  const response = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
