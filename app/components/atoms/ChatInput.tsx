import { IconArrowRight } from "@tabler/icons-react";
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
      className="flex fixed bottom-0 w-full bg-black p-5 border-t-2 border-gray-300 focus:outline-none focus:border-white"
    >
      <input
        value={value}
        placeholder={placeholder ?? "Say something..."}
        onChange={onChange}
        autoFocus
        className="w-full bg-black"
      />
      <button
        className="flex items-center justify-center w-12 h-12 bg-white rounded-full min-w-[48px] min-h-[48px]"
        type="submit"
      >
        <IconArrowRight size={20} color="black" />
      </button>
    </form>
  );
};
