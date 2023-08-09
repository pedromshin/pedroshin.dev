"use client";
import PageContainer from "@Src/app/components/templates/PageContainer";
import Heading from "@Src/app/components/organisms/Heading";
import Dropzone from "@Src/app/components/atoms/Dropzone";
import OCRResultTable from "@Src/app/components/molecules/OCRResultTable";
import { useState } from "react";

export default () => {
  const [loading, setLoading] = useState(false);
  const [OCRResult, setOCRResult] = useState([]);

  return (
    <PageContainer>
      <Heading title="OCR Expense Receipt">
        <div className="flex flex-col w-full gap-8">
          <Dropzone
            accept="image/png, image/jpeg, application/pdf"
            onSubmit={async (_, base64) => {
              setLoading(true);
              const result = await fetch("/api/projects/ocr/rg/extract", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  document: base64.split(",")[1],
                  queries: [],
                }),
              });

              setOCRResult(await result.json());
              setLoading(false);
            }}
            submitText="Extrair"
            loading={loading}
          />
          <OCRResultTable data={[]} />
        </div>
      </Heading>
    </PageContainer>
  );
};
