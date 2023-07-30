import { Block } from "@aws-sdk/client-textract";
import { ufStates } from "../../../utils/ufStates";
import { RGDataType } from ".";
import { RG_ALIAS_ENUM } from "./index";
import { detectCommonErrors } from "@/utils/ocr-detectCommonErrors";
import { validateDates } from "@/utils/ocr-validateDates";

const validateParents = (result: RGDataType) => {
  const fatherIndex = result.findIndex(
    (item) => item.field === RG_ALIAS_ENUM?.RG_OWNER_FATHER_NAME
  );
  const motherIndex = result.findIndex(
    (item) => item.field === RG_ALIAS_ENUM?.RG_OWNER_MOTHER_NAME
  );

  const fatherName = result[fatherIndex]?.value;
  const motherName = result[motherIndex]?.value;

  if (fatherName && !motherName) {
    result[fatherIndex] = {
      field: RG_ALIAS_ENUM?.RG_OWNER_FATHER_NAME,
      error: "ERROR_MISSING_VALUE",
    };
    result[motherIndex] = {
      field: RG_ALIAS_ENUM?.RG_OWNER_MOTHER_NAME,
      value: fatherName,
    };
  }

  return result;
};

const detectDocumentOrigin = (resultValue: string) => {
  const ufPattern = ufStates.join("|");
  const pattern = new RegExp(`(${ufPattern})\\b`);
  const uf = resultValue?.match(pattern)?.[1];

  return uf;
};

const findLine = (data: Block[], block: Block) => {
  const lineText = data.find((item) => {
    const itemTop = item.Geometry?.BoundingBox?.Top?.toFixed(3);
    const blockTop = block?.Geometry?.BoundingBox?.Top?.toFixed(3);

    return item.BlockType === "LINE" && Math.abs(+itemTop! - +blockTop!) < 0.02;
  });

  return lineText;
};

const normalizeSpecialCharacters = (
  specialCharsRegex: RegExp,
  resultValue: string,
  resultBlocks: Block[],
  data: Block[]
) => {
  for (const resultBlock of resultBlocks) {
    const resultLineText = findLine(data, resultBlock)?.Text;
    const normalizedResultLineText = resultLineText?.replace(
      specialCharsRegex,
      ""
    );

    if (
      (normalizedResultLineText?.includes(resultValue) ||
        resultValue?.includes(normalizedResultLineText!)) &&
      resultLineText
    ) {
      const normalizedWords = resultLineText.split(" ");
      const queryResultWords: string[] = resultValue?.split(" ");
      const indexes = [];

      for (let i = 0; i < normalizedWords.length; i++) {
        if (specialCharsRegex.test(normalizedWords[i])) {
          indexes.push(i);
        }
      }

      for (const index of indexes) {
        queryResultWords[index] = normalizedWords[index];
      }

      resultValue = queryResultWords.join(" ");
    }
  }

  return resultValue;
};

export const postProcessing = (data: Block[]) => {
  let result: RGDataType = [];
  const accentsRegex = /[\u0300-\u036f\u00c0-\u00ff]/;

  const queryBlocks = data.filter((block) => block.BlockType === "QUERY");
  const resultBlocks = data.filter(
    (block) => block.BlockType === "QUERY_RESULT"
  );

  for (const queryBlock of queryBlocks) {
    const blockAlias = queryBlock.Query?.Alias!;

    const answerIds = queryBlock.Relationships?.[0]?.Ids ?? [];

    const resultBlock = resultBlocks?.find((resultBlock) => {
      return answerIds.includes(resultBlock?.Id ?? "");
    });

    let resultValue = resultBlock?.Text;
    const resultConfidence = resultBlock?.Confidence;

    resultValue = detectCommonErrors(resultValue);

    if (!!resultValue) {
      resultValue = normalizeSpecialCharacters(
        accentsRegex,
        resultValue,
        resultBlocks,
        data
      );

      if (blockAlias === RG_ALIAS_ENUM?.RG_DOCUMENT_ORIGIN) {
        const documentOrigin = detectDocumentOrigin(resultValue);
        if (documentOrigin) resultValue = documentOrigin;
      }

      if (resultConfidence && resultConfidence < 30) {
        result.push({
          field: blockAlias,
          error: "ERROR_LOW_CONFIDENCE",
        });
      } else {
        result.push({
          field: blockAlias,
          value: resultValue,
        });
      }
    } else {
      result.push({
        field: blockAlias,
        error: `ERROR_MISSING_VALUE`,
      });
    }
  }

  result = validateParents(result);
  result = validateDates(
    result,
    RG_ALIAS_ENUM?.RG_OWNER_BIRTHDATE,
    RG_ALIAS_ENUM?.RG_DOCUMENT_EXPEDITION_DATE
  );

  return result;
};
