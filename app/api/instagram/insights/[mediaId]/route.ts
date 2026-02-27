import { NextRequest, NextResponse } from "next/server";
import { graphClient, getUserToken } from "@/app/lib/meta";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  const { mediaId } = await params;

  try {
    const res = await graphClient.get(`/${mediaId}/insights`, {
      params: {
        metric: "impressions,reach,likes,comments,shares,saved",
        access_token: getUserToken(),
      },
    });

    const metrics: Record<string, number> = {};
    for (const item of res.data.data) {
      metrics[item.name] = item.values?.[0]?.value ?? item.value ?? 0;
    }

    return NextResponse.json(metrics);
  } catch (err: unknown) {
    const error = err as { response?: { data: unknown } };
    return NextResponse.json(
      { error: error.response?.data ?? "IG insights failed" },
      { status: 500 }
    );
  }
}