import { NextResponse } from "next/server";

import textractClient from "@Src/app/api/clients/textract-client";
import TextractableDocument from "@Src/app/api/entities/textractable-document";

export async function POST(req: Request, res: Response) {
  const { document, queries } = await req.json();

  const textractableDocument = new TextractableDocument({ document, queries });

  const result = await textractClient.send(
    textractableDocument.analyzeDocument
  );

  return NextResponse.json({ result });
}
