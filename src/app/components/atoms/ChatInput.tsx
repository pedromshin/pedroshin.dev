import { InputHTMLAttributes, DOMAttributes } from "react";

export default ({
  value,
  onSubmit,
  onChange,
}: {
  value: Pick<InputHTMLAttributes<HTMLInputElement>, "value">["value"];
  onSubmit: Pick<DOMAttributes<HTMLFormElement>, "onSubmit">["onSubmit"];
  onChange: Pick<InputHTMLAttributes<HTMLInputElement>, "onChange">["onChange"];
}) => {
  return (
    <form onSubmit={onSubmit} className="fixed bottom-0 w-full">
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
