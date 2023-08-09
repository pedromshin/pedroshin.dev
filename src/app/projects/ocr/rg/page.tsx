"use client";
import { useState } from "react";

import Dropzone from "@Src/app/components/atoms/Dropzone";
import OCRResultTable from "@Src/app/components/molecules/OCRResultTable";
import Heading from "@Src/app/components/organisms/Heading";
import PageContainer from "@Src/app/components/templates/PageContainer";

export default () => {
  const [loading, setLoading] = useState(false);

  enum RG_ALIAS_ENUM {
    RG_DOCUMENT_NUMBER = "RG_DOCUMENT_NUMBER",
    RG_DOCUMENT_EXPEDITION_DATE = "RG_DOCUMENT_EXPEDITION_DATE",
    RG_OWNER_PLACE_OF_BIRTH = "RG_OWNER_PLACE_OF_BIRTH",
    RG_OWNER_BIRTHDATE = "RG_OWNER_BIRTHDATE",
    RG_OWNER_NAME = "RG_OWNER_NAME",
    RG_OWNER_FATHER_NAME = "RG_OWNER_FATHER_NAME",
    RG_OWNER_MOTHER_NAME = "RG_OWNER_MOTHER_NAME",
    RG_DOCUMENT_ORIGIN = "RG_DOCUMENT_ORIGIN",
  }

  return (
    <PageContainer>
      <Heading
        title="OCR RG"
        description="Extrair valores padronizados do verso do RG (frente é a página com foto e polegar, que não carrega nenhum dado a ser extraído)"
      >
        <div className="flex flex-col w-full gap-8">
          <Dropzone
            accept="image/png, image/jpeg, application/pdf"
            onSubmit={async (_, base64) => {
              setLoading(true);
              await fetch("/api/projects/ocr/rg/extract", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  document: base64,
                  queries: [
                    {
                      Text: "registro geral",
                      Alias: "asdasd",
                    },
                  ],
                }),
              });
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
