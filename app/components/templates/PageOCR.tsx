"use client";
import { useState } from "react";

import Dropzone from "@Components/atoms/Dropzone";
import OCRResultTable from "@Components/molecules/OCRResultTable";
import Heading from "@Components/organisms/Heading";

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
  const [OCRResult, setOCRResult] = useState([]);

  return (
    <>
      <Heading title={title} description={description}>
        <div className="flex flex-col w-full gap-8">
          <Dropzone
            accept="image/png, image/jpeg, application/pdf"
            onSubmit={async (_, base64) => {
              setLoading(true);
              const result = await fetch(fetchURL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  document: base64.split(",")[1],
                  queries: queries,
                }),
              }).finally(() => setLoading(false));

              setOCRResult(await result.json());
            }}
            submitText="Extrair"
            loading={loading}
          />
          <OCRResultTable data={OCRResult} />
        </div>
      </Heading>
    </>
  );
};
