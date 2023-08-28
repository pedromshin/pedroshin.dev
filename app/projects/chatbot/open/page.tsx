"use client";
import StreamingWords from "@App/components/atoms/StreamingWords";
import PageChatbot from "@Components/templates/PageChatbot";
import { Spinner } from "@material-tailwind/react";
import { useChat } from "ai/react";

export default () => {
  const { messages, input, isLoading, handleInputChange, handleSubmit } =
    useChat({
      api: "/api/projects/chatbot/open",
    });

  const renderMessages = () => {
    return messages?.map((message, index) => {
      if (message.role === "user") {
        return (
          <div
            key={index}
            className="border border-zinc-600 rounded-lg p-4 ml-auto"
          >
            <div className="">{message.content}</div>
          </div>
        );
      }
      if (message.role === "assistant") {
        return (
          <div
            key={index}
            className="border border-zinc-600 rounded-lg p-4 w-fit max-w-[80%]"
          >
            <StreamingWords text={message.content} />
          </div>
        );
      }
    });
  };

  return (
    <PageChatbot
      title="Open Chatbot"
      description="ChatGPT gpt-3.5-turbo model with no fine-tuning."
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4 w-full mt-8 pb-[85px] px-[12px]">
        {renderMessages()}
        {isLoading && (
          <div className="border border-zinc-600 rounded-lg p-4 w-fit max-w-[80%]">
            <Spinner />
          </div>
        )}
      </div>
    </PageChatbot>
  );
};
