"use client";
import { IconCloudUpload } from "@tabler/icons-react";
import { InputHTMLAttributes, useState } from "react";

const convertFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default ({
  accept,
  onChange,
}: {
  accept:
    | Pick<InputHTMLAttributes<HTMLInputElement>, "accept">["accept"]
    | "image/png"
    | "image/jpg"
    | "image/jpeg"
    | "application/pdf";
  onChange: (file: File) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
      >
        {!file && <IconCloudUpload size={56} />}
        <p className="flex flex-col items-center gap-2 text-2xl text-gray-500 dark:text-gray-400">
          {file?.name ? (
            <>
              <span className="font-semibold">{file.name}</span>
              <span className="font-semibold">
                {convertFileSize(file.size)}
              </span>
            </>
          ) : (
            <span>
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </span>
          )}
        </p>
        {!file && (
          <p className="text-xl text-gray-500 dark:text-gray-400">
            PNG, JPG or PDF
          </p>
        )}
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept={accept}
          onChange={(event) => {
            if (event.target.files) {
              const file = event.target.files[0];
              if (file) {
                setFile(file);
                onChange(file);
              }
            }
          }}
        />
      </label>
    </div>
  );
};
