"use client";
import ChatInput from "@Src/app/components/atoms/ChatInput";
import PageContainer from "@Src/app/components/templates/PageContainer";
import { UseChatOptions } from "ai";
import { UseChatHelpers } from "ai/react";
import { ChangeEventHandler, FormEventHandler, ReactNode } from "react";

export default ({
  children,
  input,
  handleInputChange,
  handleSubmit,
}: {
  children: ReactNode;
  input: string;
  handleInputChange: ChangeEventHandler<HTMLInputElement>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
}) => {
  return (
    <PageContainer>
      {children}
      <ChatInput
        value={input}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
      />
    </PageContainer>
  );
};
