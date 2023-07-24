class Query {
  public Text: string;
  public Alias: string;

  constructor({ Text, Alias }: { Text: string; Alias: string }) {
    this.Text = Text;
    this.Alias = Alias;
  }
}

export class TextratableDocument {
  public buffer: Buffer;
  public bytes: Uint8Array;
  public queries: Query[];

  constructor({ data, queries }: { data: string; queries: Query[] }) {
    this.buffer = Buffer.from(data, "base64");
    this.bytes = new Uint8Array(this.toArrayBuffer(this.buffer));
    this.queries = queries;
  }

  private toArrayBuffer(buffer: Buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
    }
    return arrayBuffer;
  }
}
