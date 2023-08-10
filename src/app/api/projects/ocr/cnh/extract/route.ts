import { NextResponse } from "next/server";

import textractClient from "@Src/app/api/classes/providers/textract-client.provider";

export async function POST(req: Request, res: Response) {
  console.log("Request", req);

  return NextResponse.json({ status: "ok" });
}
