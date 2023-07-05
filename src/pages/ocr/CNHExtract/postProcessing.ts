import { Block } from "@aws-sdk/client-textract";
import { CNHDataType } from ".";

export const postProcessing = (data: Block[]) => {
  let result: CNHDataType = [];

  const queryResults = data?.filter(
    (block) => block.BlockType === "QUERY" || block.BlockType === "QUERY_RESULT"
  );

  for (const block of queryResults ?? []) {
    if (block.BlockType === "QUERY") {
      const answerIds = block.Relationships?.[0]?.Ids ?? [];
      const queryResultBlock = queryResults?.find(
        (resultBlock) =>
          resultBlock.BlockType === "QUERY_RESULT" &&
          answerIds.includes(resultBlock?.Id ?? "")
      );
      const queryResultValue = queryResultBlock?.Text ?? "";
      result.push({
        field: block.Query?.Alias ?? "",
        value: queryResultValue,
      });
    }
  }

  return result;
};
