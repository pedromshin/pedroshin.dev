import { AnalyzeDocumentCommand } from "@aws-sdk/client-textract";

interface TextractableDocumentInterface {
  document: string;
  queries: { Text: string; Alias: string }[];
}

export default class TextractableDocument {
  public analyzeDocument: AnalyzeDocumentCommand;

  constructor(params: TextractableDocumentInterface) {
    this.analyzeDocument = new AnalyzeDocumentCommand({
      Document: {
        Bytes: Buffer.from(params.document, "base64"),
      },
      FeatureTypes: ["QUERIES"],
      QueriesConfig: {
        Queries: params.queries,
      },
    });
  }
}
