import { InputHTMLAttributes, DOMAttributes } from "react";

type ChatInputType = {
  value: Pick<InputHTMLAttributes<HTMLInputElement>, "value">["value"];
  onSubmit: Pick<DOMAttributes<HTMLFormElement>, "onSubmit">["onSubmit"];
  onChange: Pick<InputHTMLAttributes<HTMLInputElement>, "onChange">["onChange"];
};

export default ({ value, onSubmit, onChange }: ChatInputType) => {
  return (
    <form onSubmit={onSubmit} className="fixed bottom-0 w-full bg-black">
      <input
        value={value}
        placeholder="Say something..."
        onChange={onChange}
        autoFocus
        className="w-full p-5 border-t-2 border-gray-300 bg-transparent focus:outline-none focus:border-white"
      />
    </form>
  );
};
