import { OpenAIStream, StreamingTextResponse } from "ai";
import openaiClient from "@App/clients/openai-client";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openaiClient.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
