"use client";
import { useState } from "react";

import Dropzone from "@Src/app/components/atoms/Dropzone";
import OCRResultTable from "@Src/app/components/molecules/OCRResultTable";
import Heading from "@Src/app/components/organisms/Heading";
import PageContainer from "@Src/app/components/templates/PageContainer";

export default () => {
  const [loading, setLoading] = useState(false);

  return (
    <PageContainer>
      <Heading
        title="OCR RG"
        description="Extrair valores padronizados do verso do RG (frente é a página com foto e polegar, que não carrega nenhum dado a ser extraído)"
      >
        <div className="flex flex-col w-full gap-8">
          <Dropzone
            accept="image/png, image/jpeg, application/pdf"
            onSubmit={(_, base64) => base64}
            submitText="Extrair"
            loading={loading}
          />
          <OCRResultTable data={[]} />
        </div>
      </Heading>
    </PageContainer>
  );
};
