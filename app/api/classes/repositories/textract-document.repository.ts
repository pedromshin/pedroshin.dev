import { AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import TextractClient from "@App/clients/textract-client";

export default class TextractableDocumentRepository {
  private readonly analyzeDocument: AnalyzeDocumentCommand;
  private readonly textractClient;

  constructor(document: string, queries: { Text: string; Alias: string }[]) {
    this.textractClient = TextractClient;
    this.analyzeDocument = new AnalyzeDocumentCommand({
      Document: {
        Bytes: Buffer.from(document, "base64"),
      },
      FeatureTypes: ["QUERIES"],
      QueriesConfig: {
        Queries: queries,
      },
    });
  }

  async analyze() {
    return await this.textractClient.send(this.analyzeDocument);
  }
}
