"use client";
import { InputHTMLAttributes, useState, MouseEvent } from "react";
import { IconCloudUpload } from "@tabler/icons-react";
import Button from "./Button";
import fileToBase64 from "@App/utils/fileToBase64";
import Image from "next/image";
import { Spinner } from "@material-tailwind/react";

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
  multiple,
  onSubmit,
}: {
  accept:
    | Pick<InputHTMLAttributes<HTMLInputElement>, "accept">["accept"]
    | "image/png"
    | "image/jpg"
    | "image/jpeg"
    | "application/pdf";
  submitText: string;
  multiple?: boolean;
  loading: boolean;
  onSubmit: (file: File[], base64: string[]) => void;
}) => {
  const [documents, setDocuments] =
    useState<{ base64: string; file: File }[]>();

  const handleClear = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    setDocuments(undefined);
    e.preventDefault();
    onSubmit([], []);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer p-8"
      >
        {!documents && <IconCloudUpload size={56} />}
        {!documents && (
          <p className="text-xl text-gray-500 dark:text-gray-400">
            PNG, JPG or PDF
          </p>
        )}
        {!!documents && (
          <div
            className={`flex flex-col gap-4 ${
              documents.length === 1 ? "md:flex-row" : ""
            }`}
          >
            {documents.map(({ base64, file }) => {
              return (
                <>
                  <Image
                    width={400}
                    height={400}
                    src={base64}
                    className="max-w-md max-h-[400px]"
                    alt="droppzone"
                  />
                  {documents.length === 1 && (
                    <div className="flex flex-col gap-4">
                      <Button
                        onClick={(e) => {
                          handleClear(e);
                        }}
                      >
                        Limpar
                      </Button>
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
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </span>
                        )}
                      </p>
                      <Button onClick={() => onSubmit([file], [base64])}>
                        {loading ? <Spinner /> : submitText}
                      </Button>
                    </div>
                  )}
                </>
              );
            })}
            {documents.length > 1 && (
              <div className="flex flex-col gap-4">
                <Button onClick={(e) => handleClear(e)}>Limpar</Button>
                <Button
                  onClick={() =>
                    onSubmit(
                      documents.map((document) => document.file),
                      documents.map((document) => document.base64)
                    )
                  }
                >
                  {loading ? <Spinner /> : submitText}
                </Button>
              </div>
            )}
          </div>
        )}
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={async (event) => {
            if (!event.target.files) return;
            const files = Array.from(event.target.files);
            if (!files) return;
            const base64s = await Promise.all(
              files.map(
                async (file) =>
                  await fileToBase64(file).then((base64) => base64)
              )
            );
            setDocuments(
              files.map((file, index) => ({
                base64: base64s[index],
                file,
              }))
            );
          }}
        />
      </label>
    </div>
  );
};
