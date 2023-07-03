import { Block } from "@aws-sdk/client-textract";
import { ufStates } from "./ufStates";
import { RGDataType } from ".";

const detectDocumentOrigin = (resultValue: string) => {
  const ufPattern = ufStates.join("|");
  const pattern = new RegExp(`(${ufPattern})\\b`);
  const uf = resultValue?.match(pattern)?.[1];

  return uf;
};

const detectNormalizedValues = (
  data: Block[],
  queryResultValue: string,
  block: Block,
  queryResultBlock: Block | undefined,
  blockAlias: string
) => {
  let result = [];
  let resultValue = queryResultValue;

  const queryResultBlockLine = data.find((resultBlock) => {
    const resultBlockTop = resultBlock.Geometry?.BoundingBox?.Top?.toFixed(3);
    const queryResultBlockTop =
      queryResultBlock?.Geometry?.BoundingBox?.Top?.toFixed(3);

    return (
      resultBlock.BlockType === "LINE" &&
      Math.abs(+resultBlockTop! - +queryResultBlockTop!) < 0.02
    );
  });

  const queryResultBlockLineText = queryResultBlockLine?.Text ?? "";

  const accentsRegex = /[\u0300-\u036f\u00c0-\u00ff]/;

  const normalizeQueryResultBlockLine = queryResultBlockLineText.replace(
    accentsRegex,
    ""
  );

  if (
    normalizeQueryResultBlockLine.includes(queryResultValue) ||
    queryResultValue.includes(normalizeQueryResultBlockLine)
  ) {
    const normalizedWords = queryResultBlockLineText.split(" ");
    const queryResultWords = queryResultValue.split(" ");
    const indexes = [];

    for (let i = 0; i < normalizedWords.length; i++) {
      if (accentsRegex.test(normalizedWords[i])) {
        indexes.push(i);
      }
    }

    for (const index of indexes) {
      queryResultWords[index] = normalizedWords[index];
    }

    queryResultValue = queryResultWords.join(" ");
  }

  if (blockAlias === "RG_DOCUMENT_ORIGIN") {
    const documentOrigin = detectDocumentOrigin(queryResultValue);
    if (documentOrigin) resultValue = documentOrigin;
  }

  result.push({
    field: block.Query?.Alias ?? "",
    value: resultValue,
  });

  return result;
};

export const postProcessing = (data: Block[]) => {
  let result: RGDataType = [];

  const queryBlocks = data.filter((block) => block.BlockType === "QUERY");
  const resultBlocks = data.filter(
    (block) => block.BlockType === "QUERY_RESULT"
  );

  for (const block of queryBlocks) {
    const blockAlias = block.Query?.Alias!;

    const answerIds = block.Relationships?.[0]?.Ids ?? [];

    const resultBlock = resultBlocks?.find((resultBlock) => {
      return answerIds.includes(resultBlock?.Id ?? "");
    });

    let resultValue = resultBlock?.Text;

    if (!!resultValue) {
      result.push(
        ...detectNormalizedValues(
          data,
          resultValue!,
          block,
          resultBlock,
          blockAlias
        )
      );
    } else {
      result.push({
        field: blockAlias,
        error: `ERROR_MISSING_VALUE_${blockAlias}`,
      });
    }
  }

  return result;
};
