import { NextRequest, NextResponse } from "next/server";
import { graphClient, getPageToken } from "@/app/lib/meta";
import type { PostEngagement } from "@/app/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;

  try {
    const [engRes, insightsRes] = await Promise.all([
      graphClient.get(`/${postId}`, {
        params: {
          fields: "likes.summary(true),comments.summary(true),shares",
          access_token: getPageToken(),
        },
      }),
      graphClient.get(`/${postId}/insights`, {
        params: {
          metric: "post_impressions,post_reach",
          access_token: getPageToken(),
        },
      }),
    ]);

    const eng = engRes.data;
    const insightData: Array<{ name: string; values: Array<{ value: number }> }> =
      insightsRes.data.data;

    const findMetric = (name: string) =>
      insightData.find((m) => m.name === name)?.values[0]?.value ?? 0;

    const result: PostEngagement = {
      likes: eng.likes?.summary?.total_count ?? 0,
      comments: eng.comments?.summary?.total_count ?? 0,
      shares: eng.shares?.count ?? 0,
      impressions: findMetric("post_impressions"),
      reach: findMetric("post_reach"),
    };

    return NextResponse.json(result);
  } catch (err: unknown) {
    const error = err as { response?: { data: unknown } };
    return NextResponse.json(
      { error: error.response?.data ?? "Insights fetch failed" },
      { status: 500 }
    );
  }
}