import { IconCloudUpload } from "@tabler/icons-react";
import { InputHTMLAttributes } from "react";

export default ({
  accept,
}: {
  accept:
    | Pick<InputHTMLAttributes<HTMLInputElement>, "accept">["accept"]
    | "image/png"
    | "image/jpg"
    | "image/jpeg"
    | "application/pdf";
}) => {
  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <IconCloudUpload size={56} />
          <p className="text-2xl text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            PNG, JPG or PDF
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept={accept}
        />
      </label>
    </div>
  );
};
