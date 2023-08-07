import Dropzone from "@Src/app/components/atoms/Dropzone";
import Heading from "@Src/app/components/organisms/Heading";
import PageContainer from "@Src/app/components/templates/PageContainer";

export default () => {
  return (
    <PageContainer>
      <Heading title="OCR RG">
        <Dropzone accept="image/png, image/jpeg, application/pdf" />
      </Heading>
    </PageContainer>
  );
};
