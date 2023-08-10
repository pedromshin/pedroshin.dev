"use client";
import { ChangeEventHandler, FormEventHandler, ReactNode } from "react";

import ChatInput from "@App/components/atoms/ChatInput";
import Heading from "@App/components/organisms/Heading";

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
