import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import _ from "lodash-es";

export const config = {
  runtime: "edge",
  unstable_allowDynamic: ["**/node_modules/lodash-es/*"],
};
const OPEN_AI_KEY = process.env.OPEN_AI_KEY;

const aiConfig = new Configuration({
  apiKey: OPEN_AI_KEY,
});

const openAI = new OpenAIApi(aiConfig);

export default async function POST(req: any) {
  const res = await req.json();
  const messages = _.clone(res.messages);

  messages.push({
    role: "system",
    content: "",
  });

  const response = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: messages,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
