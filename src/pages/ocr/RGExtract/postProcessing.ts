import { Block } from "@aws-sdk/client-textract";
import { ufStates } from "./ufStates";

const detectDocumentOrigin = (queryResultValue: string) => {
  const ufPattern = ufStates.join("|");
  const pattern = new RegExp(`(${ufPattern})\\b`);
  const uf = queryResultValue?.match(pattern);

  return {
    field: "EMISSION_UF_STATE",
    value: uf?.[1] ?? "",
    error: null,
  };
};

const detectParenstNames = (
  data: Block[],
  queryResultValue: string,
  block: Block,
  queryResultBlock: Block | undefined
) => {
  let result = [];

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

  result.push({
    field: block.Query?.Alias ?? "",
    value: queryResultValue,
    error: null,
  });

  return result;
};

export const postProcessing = (data: Block[]) => {
  let result = [];

  const queryResults = data.filter(
    (block) => block.BlockType === "QUERY" || block.BlockType === "QUERY_RESULT"
  );

  for (const block of queryResults) {
    if (block.BlockType === "QUERY") {
      const answerIds = block.Relationships?.[0]?.Ids ?? [];

      const queryResultBlock = queryResults?.find(
        (resultBlock) =>
          resultBlock.BlockType === "QUERY_RESULT" &&
          answerIds.includes(resultBlock?.Id ?? "")
      );

      let queryResultValue = queryResultBlock?.Text ?? "";

      if (block.Query?.Alias! === "DOCUMENT_ORIGIN")
        result.push(detectDocumentOrigin(queryResultValue));

      result.push(
        ...detectParenstNames(data, queryResultValue, block, queryResultBlock)
      );
    }
  }

  return result;
};
