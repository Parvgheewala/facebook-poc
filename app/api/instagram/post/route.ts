import { NextRequest, NextResponse } from "next/server";
import { graphClient, getUserToken, getIgAccountId } from "@/app/lib/meta";
import type { IGPostPayload } from "@/app/lib/types";

export async function POST(req: NextRequest) {
  const body: IGPostPayload = await req.json();
  const { imageUrl, caption } = body;

  if (!imageUrl) {
    return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
  }

  const igId = getIgAccountId();
  const token = getUserToken();

  try {
    const containerRes = await graphClient.post(
      `/${igId}/media`,
      {
        image_url: imageUrl,
        caption: caption ?? "",
        media_type: "IMAGE",
      },
      { params: { access_token: token } }
    );

    const containerId: string = containerRes.data.id;

    await new Promise((r) => setTimeout(r, 3000));

    const statusRes = await graphClient.get(`/${containerId}`, {
      params: {
        fields: "status_code",
        access_token: token,
      },
    });

    if (statusRes.data.status_code !== "FINISHED") {
      return NextResponse.json(
        { error: "Container not ready", status: statusRes.data.status_code },
        { status: 422 }
      );
    }

    const publishRes = await graphClient.post(
      `/${igId}/media_publish`,
      { creation_id: containerId },
      { params: { access_token: token } }
    );

    return NextResponse.json({ mediaId: publishRes.data.id });
  } catch (err: unknown) {
    const error = err as { response?: { data: unknown } };
    return NextResponse.json(
      { error: error.response?.data ?? "IG post failed" },
      { status: 500 }
    );
  }
}
