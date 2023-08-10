import { NextResponse } from "next/server";

import TextractableDocumentRepository from "@Src/app/api/classes/repositories/textract-document.repository";

export async function POST(req: Request, res: Response) {
  const { document, queries } = await req.json();

  const output = await new TextractableDocumentRepository(
    document,
    queries
  ).analyze();

  return NextResponse.json({ output });
}
