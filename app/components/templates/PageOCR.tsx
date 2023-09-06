"use client";
import { useState } from "react";

import Dropzone from "@Components/atoms/Dropzone";
import OCRResultTable from "@Components/molecules/OCRResultTable";
import Heading from "@Components/organisms/Heading";
import { TextractableDocumentResultType } from "@App/types/TextractableDocumentResultType";

export default ({
  fetchURL,
  queries,
  title,
  description,
}: {
  fetchURL: string;
  title: string;
  description?: string;
  queries: any[];
}) => {
  const [loading, setLoading] = useState(false);
  const [OCRResult, setOCRResult] = useState<TextractableDocumentResultType[]>(
    []
  );

  return (
    <>
      <Heading title={title} description={description}>
        <div className="flex flex-col w-full gap-8">
          <Dropzone
            multiple
            accept="image/png, image/jpeg, application/pdf"
            onSubmit={async (_, base64s) => {
              setLoading(true);
              const results = Promise.all(
                base64s.map(async (base64) => {
                  const result = await fetch(fetchURL, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      document: base64.split(",")[1],
                      queries: queries,
                    }),
                  });

                  return await result.json();
                })
              );

              setOCRResult(await results.finally(() => setLoading(false)));
            }}
            submitText="Extrair"
            loading={loading}
          />
          {OCRResult.map((OCRResult, index) => (
            <OCRResultTable key={index} data={OCRResult} />
          ))}
        </div>
      </Heading>
    </>
  );
};
