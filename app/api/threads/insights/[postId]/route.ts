import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const threadsClient = axios.create({
  baseURL: "https://graph.threads.net/v1.0",
  timeout: 10000,
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const token = process.env.META_USER_ACCESS_TOKEN!;

  try {
    const res = await threadsClient.get(`/${postId}/insights`, {
      params: {
        metric: "views,likes,replies,reposts,quotes",
        access_token: token,
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
      { error: error.response?.data ?? "Threads insights failed" },
      { status: 500 }
    );
  }
}