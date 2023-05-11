import RGExtract from "./RGExtract/index";
import RGHighContrastExtract from "./RGHighContrastExtract";
import CNHExtract from "./CNHExtract";
import GeneralFormDataExtraction from "./GeneralFormDataExtraction";
import GeneralTableDataExtraction from "./GeneralTableDataExtraction";

const Ocr = () => {
  return (
    <>
      <RGExtract />
      <RGHighContrastExtract />
      <CNHExtract />
      <GeneralFormDataExtraction />
      {/* <GeneralTableDataExtraction /> */}
    </>
  );
};

export default Ocr;
