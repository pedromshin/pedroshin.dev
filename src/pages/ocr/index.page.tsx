import RGExtract from "./RGExtract/index";
import RGHighContrastExtract from "./RGHighContrastExtract";
import CNHExtract from "./CNHExtract";
import GeneralFormDataExtraction from "./GeneralFormDataExtraction";
import GeneralTableDataExtraction from "./GeneralTableDataExtraction";
import { ExpenseExtract } from "./ExpenseExtract";
import { PageContainer } from "@/components/PageContainer";

const Ocr = () => {
  return (
    <PageContainer>
      <RGExtract />
      <RGHighContrastExtract />
      <CNHExtract />
      <GeneralFormDataExtraction />
      {/* <GeneralTableDataExtraction /> */}
      <ExpenseExtract />
    </PageContainer>
  );
};

export default Ocr;
