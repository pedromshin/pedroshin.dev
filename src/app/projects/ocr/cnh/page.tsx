import PageContainer from "@Src/app/components/templates/PageContainer";
import Heading from "@Src/app/components/organisms/Heading";
import Dropzone from "@Src/app/components/atoms/Dropzone";

export default () => {
  return (
    <PageContainer>
      <Heading title="OCR CNH">
        <Dropzone
          accept="image/png, image/jpeg, application/pdf"
          onChange={(file) => console.log(file)}
        />
      </Heading>
    </PageContainer>
  );
};
