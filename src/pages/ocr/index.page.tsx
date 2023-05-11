import RGExtract from "./RGExtract/index";
import RGHighContrastExtract from "./RGHighContrastExtract";
import CNHExtract from "./CNHExtract";
import GeneralFormDataExtraction from "./GeneralFormDataExtraction";
import GeneralTableDataExtraction from "./GeneralTableDataExtraction";
import { ExpenseExtract } from "./ExpenseExtract";
import { PDFExtract } from "./PDFExtract";

const Ocr = () => {
  return (
    <>
      <RGExtract />
      <RGHighContrastExtract />
      <CNHExtract />
      <GeneralFormDataExtraction />
      {/* <GeneralTableDataExtraction /> */}
      <ExpenseExtract />
      {/* <PDFExtract /> */}
    </>
  );
};

export default Ocr;
