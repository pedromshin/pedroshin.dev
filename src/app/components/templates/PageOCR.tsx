"use client";
import { useState } from "react";

import Dropzone from "@Src/app/components/atoms/Dropzone";
import OCRResultTable from "@Src/app/components/molecules/OCRResultTable";
import Heading from "@Src/app/components/organisms/Heading";
import PageContainer from "@Src/app/components/templates/PageContainer";

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
    <PageContainer>
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
              });

              setOCRResult(await result.json());
              setLoading(false);
            }}
            submitText="Extrair"
            loading={loading}
          />
          <OCRResultTable data={OCRResult} />
        </div>
      </Heading>
    </PageContainer>
  );
};
