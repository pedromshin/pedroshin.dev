"use client";
import PageChatbot from "@Src/app/components/templates/PageChatbot";
import Heading from "@Src/app/components/organisms/Heading";
import { useChat } from "ai/react";

export default () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <PageChatbot
      input={input}
      title="Flash Chatbot"
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
    >
      <></>
    </PageChatbot>
  );
};
