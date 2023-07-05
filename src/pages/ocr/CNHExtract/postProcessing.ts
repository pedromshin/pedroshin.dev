import { Block } from "@aws-sdk/client-textract";
import { CNHDataType, CNH_ALIAS_ENUM } from ".";

const detectCommonErrors = (resultValue?: string) => {
  if (resultValue) {
    const commonErrors = ["NATURALIDACE", "NATURALIDADE"];
    if (commonErrors.includes(resultValue)) {
      resultValue = "";
    }
  }

  return resultValue;
};

const validateExpiryDate = (result: CNHDataType) => {
  // TODO improve this validation
  const expiryDateIndex = result.findIndex(
    (item) => item.field === CNH_ALIAS_ENUM.CNH_DOCUMENT_EXPIRY_DATE
  );
  const ownerBirthDateIndex = result.findIndex(
    (item) => item.field === CNH_ALIAS_ENUM.CNH_OWNER_BIRTHDATE
  );
  const expiryDate = result[expiryDateIndex]?.value;
  const ownerBirthDate = result[ownerBirthDateIndex]?.value;

  if (expiryDate && ownerBirthDate) {
    if (expiryDate === ownerBirthDate) {
      result[expiryDateIndex] = {
        field: CNH_ALIAS_ENUM.CNH_DOCUMENT_EXPIRY_DATE,
        error: "ERROR_INVALID_VALUE",
      };
      result[ownerBirthDateIndex] = {
        field: CNH_ALIAS_ENUM.CNH_OWNER_BIRTHDATE,
        error: "ERROR_INVALID_VALUE",
      };
    }
  }

  return result;
};

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

  result = validateExpiryDate(result);

  return result;
};
