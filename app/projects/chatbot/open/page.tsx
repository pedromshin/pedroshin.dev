"use client";
import PageChatbot from "@Components/templates/PageChatbot";
import { useChat } from "ai/react";

export default () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/projects/chatbot/open",
  });

  return (
    <PageChatbot
      input={input}
      title="Open Chatbot"
      description="ChatGPT gpt-3.5-turbo model with no fine-tuning."
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
    >
      {messages?.map((m) => (
        <div key={m?.id} className={"mb-2 p-2"}>
          <span className={"font-bold"}>{m?.role}: </span>
          <span>{m?.content}</span>
        </div>
      ))}
      <></>
    </PageChatbot>
  );
};
