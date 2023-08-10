import { NextResponse } from "next/server";

import TextractableDocumentRepository from "@Src/app/api/classes/repositories/textract-document.repository";
import TextractableDocumentEntity from "@Src/app/api/classes/entities/textract-document.entity";

export async function POST(req: Request, res: Response) {
  const { document, queries } = await req.json();

  const output = await new TextractableDocumentRepository(
    document,
    queries
  ).analyze();

  const result = new TextractableDocumentEntity(output).process();

  return NextResponse.json(result);
}
