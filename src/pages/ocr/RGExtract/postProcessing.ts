import { Block } from "@aws-sdk/client-textract";
import { ufStates } from "./ufStates";
import { RGDataType } from ".";

const detectDocumentOrigin = (resultValue: string) => {
  const ufPattern = ufStates.join("|");
  const pattern = new RegExp(`(${ufPattern})\\b`);
  const uf = resultValue?.match(pattern)?.[1];

  return uf;
};

const findLine = (data: Block[], resultBlocks: Block[]) => {
  const lineText = data.find((item) => {
    const itemTop = item.Geometry?.BoundingBox?.Top?.toFixed(3);

    const block = resultBlocks.find((block) => {
      const blockTop = block?.Geometry?.BoundingBox?.Top?.toFixed(3);

      return (
        item.BlockType === "LINE" && Math.abs(+itemTop! - +blockTop!) < 0.02
      );
    });

    return block;
  });

  return lineText?.Text ?? "";
};

const normalizeSpecialCharacters = (
  specialCharsRegex: RegExp,
  resultValue: string,
  resultBlocks: Block[],
  data: Block[]
) => {
  const resultLineText = findLine(data, resultBlocks);

  const normalizedResultLineText = resultLineText.replace(
    specialCharsRegex,
    ""
  );

  if (
    normalizedResultLineText.includes(resultValue) ||
    resultValue?.includes(normalizedResultLineText)
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

  return resultValue;
};

const detectCommonErrors = (resultValue?: string) => {
  if (resultValue) {
    const commonErrors = ["NATURALIDACE", "NATURALIDADE"];
    if (commonErrors.includes(resultValue)) {
      resultValue = "";
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

      if (blockAlias === "RG_DOCUMENT_ORIGIN") {
        const documentOrigin = detectDocumentOrigin(resultValue);
        if (documentOrigin) resultValue = documentOrigin;
      }

      if (resultConfidence && resultConfidence < 90) {
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

  return result;
};
