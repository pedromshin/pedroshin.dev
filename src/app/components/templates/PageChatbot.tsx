"use client";
import ChatInput from "@Src/app/components/atoms/ChatInput";
import { ChangeEventHandler, FormEventHandler, ReactNode } from "react";
import Heading from "@Components/organisms/Heading";

export default ({
  children,
  input,
  title,
  handleInputChange,
  handleSubmit,
}: {
  children: ReactNode;
  input: string;
  title: string;
  handleInputChange: ChangeEventHandler<HTMLInputElement>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
}) => {
  return (
    <>
      <Heading title={title}>{children}</Heading>
      <ChatInput
        value={input}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
      />
    </>
  );
};
