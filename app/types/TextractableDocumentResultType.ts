export type TextractableDocumentResultType = Array<
  | {
      field: string;
      value: string;
      error?: never;
    }
  | { field: string; value?: never; error: string }
>;
