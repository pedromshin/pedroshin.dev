import { Block } from "@aws-sdk/client-textract";
import { CNHDataType, CNH_ALIAS_ENUM } from ".";
import { detectCommonErrors } from "@/utils/ocr-detectCommonErrors";
import { validateDates } from "@/utils/ocr-validateDates";

export const postProcessing = (data: Block[]) => {
  let result: CNHDataType = [];

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
      if (resultConfidence && resultConfidence < 80) {
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

  result = validateDates(
    result,
    CNH_ALIAS_ENUM.CNH_OWNER_BIRTHDATE,
    CNH_ALIAS_ENUM.CNH_DOCUMENT_EXPIRY_DATE
  );

  return result;
};
