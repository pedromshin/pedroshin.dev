import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
class Query {
  public Text: string;
  public Alias: string;

  constructor({ Text, Alias }: { Text: string; Alias: string }) {
    this.Text = Text;
    this.Alias = Alias;
  }
}

class Params {
  constructor({ Bytes, Queries }: { Bytes: Uint8Array; Queries: Query[] }) {
    this.Document = { Bytes };
    this.FeatureTypes = ["QUERIES"];
    this.QueriesConfig = { Queries: Queries };
  }

  public Document: { Bytes: Uint8Array };
  public FeatureTypes: string[];
  public QueriesConfig: { Queries: Query[] };
}

export class TextractableDocument {
  public fileType: string;
  public buffer: Buffer;
  public uint8array: Promise<Uint8Array>;
  public queries: Query[];
  public mime: string;
  public params: Params;

  private base64: string;

  constructor({
    base64,
    queries,
    fileType,
  }: {
    base64: string;
    fileType: string;
    queries: Query[];
  }) {
    this.fileType = fileType;
    this.queries = queries;
    this.base64 = base64;
    this.buffer = this.base64ToBuffer(this.base64);
    this.uint8array = this.bufferToUint8Array(this.buffer);
    this.mime = this.base64.split(",")[0];
    this.params = new Params({ Bytes: this.buffer, Queries: this.queries });
  }

  private base64ToBuffer = (data: string): Buffer => {
    const base64Data = data.split(",")[1];
    return Buffer.from(base64Data, "base64");
  };

  private bufferToUint8Array = async (buffer: Buffer): Promise<Uint8Array> => {
    if (this.fileType === "application/pdf") {
      const loadingTask = pdfjsLib.getDocument(new Uint8Array(buffer));

      const result = await loadingTask.promise.then(async (pdf) => {
        return pdf.getPage(1).then(async (page) => {
          const viewport = page.getViewport({ scale: 1 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          return await page
            .render({
              canvasContext: context!,
              viewport: viewport,
            })
            .promise.then(() => {
              const imageDataUrl = canvas.toDataURL("image/png");
              const bytes = this.dataURLtoBytes(imageDataUrl);
              return bytes;
            });
        });
      });

      // Check if it's already a Promise, return it as-is; otherwise, wrap it in a Promise
      return result instanceof Promise ? result : Promise.resolve(result);
    } else {
      return Promise.resolve(new Uint8Array(buffer));
    }
  };

  private dataURLtoBytes = (dataUrl: string): Uint8Array => {
    const base64 = dataUrl.split(",")[1];
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  public uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
    const binaryString = uint8Array.reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      ""
    );
    return btoa(binaryString);
  };
}
