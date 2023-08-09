import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  console.log("Request", req);

  return NextResponse.json({ status: "ok" });
}
