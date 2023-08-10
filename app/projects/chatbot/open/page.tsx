"use client";
import PageChatbot from "@App/components/templates/PageChatbot";
import { useChat } from "ai/react";

export default () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <PageChatbot
      input={input}
      title="Open Chatbot"
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
    >
      <></>
    </PageChatbot>
  );
};
