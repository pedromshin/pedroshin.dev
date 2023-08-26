"use client";
import { ChangeEventHandler, FormEventHandler, ReactNode } from "react";

import ChatInput from "@Components/atoms/ChatInput";
import Heading from "@Components/organisms/Heading";

export default ({
  children,
  input,
  title,
  configurations,
  description,
  handleInputChange,
  handleSubmit,
}: {
  children: ReactNode;
  input: string;
  title: string;
  description?: string;
  configurations?: ReactNode;
  handleInputChange: ChangeEventHandler<HTMLInputElement>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
}) => {
  return (
    <>
      <Heading title={title} description={description}>
        {configurations}
      </Heading>
      <div className="w-full border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-white" />
      <div className="flex flex-col items-center justify-start p-12 lg:items-start">
        {children}
      </div>
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
