import { TextractableDocumentResultType } from "@App/types/TextractableDocumentResultType";
import {
  AnalyzeDocumentCommandOutput,
  Block,
  BlockType,
} from "@aws-sdk/client-textract";

export default class TextractableDocumentEntity {
  private blocks: Block[];
  private queryBlocks: Block[];
  private resultBlocks: Block[];
  private result: TextractableDocumentResultType = [];

  constructor(data: AnalyzeDocumentCommandOutput) {
    this.blocks = data.Blocks || [];
    this.queryBlocks = this.filterBlocks(this.blocks, "QUERY") || [];
    this.resultBlocks = this.filterBlocks(this.blocks, "QUERY_RESULT") || [];
  }

  private filterBlocks(blocks: Block[] | undefined, type: BlockType) {
    return blocks?.filter((block) => block.BlockType === type);
  }

  private detectErrors(resultValue: string) {
    const commonErrors = ["NATURALIDACE", "NATURALIDADE", "Funnam", "funnam"];

    return commonErrors.includes(resultValue) ? "" : resultValue;
  }

  private validateConfidence(
    resultConfidence: number,
    blockAlias: string,
    resultValue: string
  ): void {
    const validationEntry =
      // Disabled confidence validation
      resultConfidence < 0
        ? { field: blockAlias, error: "ERROR_LOW_CONFIDENCE" }
        : { field: blockAlias, value: resultValue };

    this.result.push(validationEntry);
  }

  process() {
    for (const queryBlock of this.queryBlocks) {
      const blockAlias = queryBlock.Query?.Alias!;
      const resultBlock = this.resultBlocks?.find((resultBlock) => {
        return resultBlock?.Id
          ? queryBlock.Relationships?.[0]?.Ids?.includes(resultBlock?.Id)
          : "";
      });

      if (!resultBlock?.Text) {
        this.result.push({
          field: blockAlias,
          error: `ERROR_MISSING_VALUE`,
        });
      }

      const resultValue = this.detectErrors(resultBlock?.Text ?? "");

      this.validateConfidence(
        resultBlock?.Confidence ?? 0,
        queryBlock.Query?.Alias!,
        resultValue
      );
    }

    return this.result;
  }
}
