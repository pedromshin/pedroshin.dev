"use client";
import { InputHTMLAttributes, useState, MouseEvent } from "react";
import { IconCloudUpload } from "@tabler/icons-react";
import Button from "./Button";
import fileToBase64 from "@Src/app/utils/fileToBase64";

const convertFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default ({
  accept,
  submitText,
  loading,
  onSubmit,
}: {
  accept:
    | Pick<InputHTMLAttributes<HTMLInputElement>, "accept">["accept"]
    | "image/png"
    | "image/jpg"
    | "image/jpeg"
    | "application/pdf";
  submitText: string;
  loading: boolean;
  onSubmit: (file: File, base64: string) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string>("");

  const handleClear = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    setFile(null);
    setBase64("");
    e.preventDefault();
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer p-8"
      >
        {!file && <IconCloudUpload size={56} />}
        {!file && (
          <p className="text-xl text-gray-500 dark:text-gray-400">
            PNG, JPG or PDF
          </p>
        )}
        {!!base64 && !!file && (
          <div className="flex flex-col gap-4 lg:flex-row">
            <img
              src={base64}
              className="w-full max-w-2xl h-auto"
              alt="dropzone"
            />
            <div className="flex flex-col gap-4">
              <Button onClick={(e) => handleClear(e)}>Limpar</Button>
              <p className="flex flex-col gap-2 text-2xl text-gray-500 dark:text-gray-400">
                {file?.name ? (
                  <>
                    <span className="font-semibold">{file.name}</span>
                    <span className="font-semibold">
                      {convertFileSize(file.size)}
                    </span>
                  </>
                ) : (
                  <span>
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </span>
                )}
              </p>
              <Button onClick={() => onSubmit(file, base64)}>
                {loading ? "loading..." : submitText}
              </Button>
            </div>
          </div>
        )}
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept={accept}
          onChange={async (event) => {
            if (event.target.files) {
              const file = event.target.files[0];
              if (file) {
                const base64 = await fileToBase64(file).then();
                setFile(file);
                setBase64(base64);
              }
            }
          }}
        />
      </label>
    </div>
  );
};
