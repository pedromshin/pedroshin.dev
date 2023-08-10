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

  private specialCharsRegex = /[\u0300-\u036f\u00c0-\u00ff]/;

  private filterBlocks(blocks: Block[] | undefined, type: BlockType) {
    return blocks?.filter((block) => block.BlockType === type);
  }

  private detectErrors(resultValue: string) {
    const commonErrors = ["NATURALIDACE", "NATURALIDADE"];

    return commonErrors.includes(resultValue) ? "" : resultValue;
  }

  private findLine(resultBlock: Block) {
    const line = this.blocks.find((block) => {
      const blockTop = block.Geometry?.BoundingBox?.Top?.toFixed(3);
      const resultBlockTop =
        resultBlock?.Geometry?.BoundingBox?.Top?.toFixed(3);

      return (
        block.BlockType === "LINE" &&
        Math.abs(+blockTop! - +resultBlockTop!) < 0.02
      );
    })?.Text;

    return line ?? "";
  }

  private normalizeSpecialCharacters(resultValue: string) {
    let normalizedResultValue = resultValue;
    for (const resultBlock of this.resultBlocks) {
      const resultLineText = this.findLine(resultBlock);

      const normalizedResultLineText = resultLineText?.replace(
        this.specialCharsRegex,
        ""
      );

      if (
        normalizedResultLineText?.includes(resultValue) ||
        resultValue?.includes(normalizedResultLineText!)
      ) {
        const normalizedWords = resultLineText.split(" ");
        const queryResultWords: string[] = resultValue?.split(" ");
        const indexes: number[] = [];
        normalizedWords.forEach((word, index) => {
          if (word === queryResultWords[index]) indexes.push(index);
        });
        indexes.forEach(
          (index) => (queryResultWords[index] = normalizedWords[index])
        );
        normalizedResultValue = queryResultWords.join(" ");
      }
    }
    return resultValue;
  }

  private validateConfidence(
    resultConfidence: number,
    blockAlias: string,
    resultValue: string
  ): void {
    const validationEntry =
      resultConfidence < 30
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
      const normalizedResultValue =
        this.normalizeSpecialCharacters(resultValue);

      this.validateConfidence(
        resultBlock?.Confidence ?? 0,
        queryBlock.Query?.Alias!,
        normalizedResultValue
      );
    }

    return this.result;
  }
}
