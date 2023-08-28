"use client";
import { ChangeEventHandler, FormEventHandler, ReactNode } from "react";

import ChatInput from "@Components/atoms/ChatInput";
import Heading from "@Components/organisms/Heading";

export default ({
  children,
  input,
  title,
  description,
  handleInputChange,
  handleSubmit,
}: {
  children: ReactNode;
  input: string;
  title?: string;
  description?: string;
  handleInputChange: ChangeEventHandler<HTMLInputElement>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
}) => {
  return (
    <>
      {title && <Heading title={title} description={description} />}
      {children}
      <ChatInput
        value={input}
        onSubmit={(e) => {
          handleSubmit(e);
          e.preventDefault();
        }}
        onChange={handleInputChange}
      />
    </>
  );
};
