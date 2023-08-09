import { NextResponse } from "next/server";

import textractClient from "@Src/app/api/clients/textract-client";

export async function POST(req: Request, res: Response) {
  console.log("Request", req);

  return NextResponse.json({ status: "ok" });
}
