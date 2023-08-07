"use client";
import PageContainer from "@Src/app/components/templates/PageContainer";
import Heading from "@Src/app/components/organisms/Heading";
import Dropzone from "@Src/app/components/atoms/Dropzone";
import OCRResultTable from "@Src/app/components/molecules/OCRResultTable";

export default () => {
  return (
    <PageContainer>
      <Heading title="OCR CNH">
        <div className="flex flex-col w-full gap-8">
          <Dropzone
            accept="image/png, image/jpeg, application/pdf"
            onChange={(file) => console.log(file)}
          />
          <OCRResultTable data={[]} />
        </div>
      </Heading>
    </PageContainer>
  );
};
