import { InputHTMLAttributes, DOMAttributes } from "react";

type ChatInputType = {
  value: Pick<InputHTMLAttributes<HTMLInputElement>, "value">["value"];
  placeholder?: string;
  onSubmit: Pick<DOMAttributes<HTMLFormElement>, "onSubmit">["onSubmit"];
  onChange: Pick<InputHTMLAttributes<HTMLInputElement>, "onChange">["onChange"];
};

export default ({ value, placeholder, onSubmit, onChange }: ChatInputType) => {
  return (
    <form
      onSubmit={(e) => {
        onSubmit && onSubmit(e);
        e.preventDefault();
      }}
      className="fixed bottom-0 w-full bg-black"
    >
      <input
        value={value}
        placeholder={placeholder ?? "Say something..."}
        onChange={onChange}
        autoFocus
        className="w-full p-5 border-t-2 border-gray-300 bg-transparent focus:outline-none focus:border-white"
      />
    </form>
  );
};
