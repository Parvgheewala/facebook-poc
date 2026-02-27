import { NextRequest, NextResponse } from "next/server";
import { graphClient, getPageToken, getPageId } from "@/app/lib/meta";
import type { FBPostPayload } from "@/app/lib/types";

export async function POST(req: NextRequest) {
  const body: FBPostPayload = await req.json();
  const { message, link } = body;

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  try {
    const res = await graphClient.post(
      `/${getPageId()}/feed`,
      { message, ...(link && { link }) },
      { params: { access_token: getPageToken() } }
    );
    return NextResponse.json({ postId: res.data.id });
  } catch (err: unknown) {
    const error = err as { response?: { data: unknown } };
    return NextResponse.json(
      { error: error.response?.data ?? "Post failed" },
      { status: 500 }
    );
  }
}
