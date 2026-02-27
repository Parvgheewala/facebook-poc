import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import type { ThreadsPostPayload } from "@/app/lib/types";

const threadsClient = axios.create({
  baseURL: "https://graph.threads.net/v1.0",
  timeout: 10000,
});

function getThreadsUserId(): string {
  const id = process.env.META_THREADS_USER_ID;
  if (!id) throw new Error("META_THREADS_USER_ID not set");
  return id;
}

function getThreadsToken(): string {
  const token = process.env.META_USER_ACCESS_TOKEN;
  if (!token) throw new Error("META_USER_ACCESS_TOKEN not set");
  return token;
}

export async function POST(req: NextRequest) {
  const body: ThreadsPostPayload = await req.json();
  const { text, mediaType = "TEXT", imageUrl } = body;

  const userId = getThreadsUserId();
  const token = getThreadsToken();

  try {
    const containerPayload: Record<string, string> = {
      media_type: mediaType,
      text,
    };
    if (mediaType === "IMAGE" && imageUrl) {
      containerPayload.image_url = imageUrl;
    }

    const containerRes = await threadsClient.post(
      `/${userId}/threads`,
      containerPayload,
      { params: { access_token: token } }
    );

    const containerId: string = containerRes.data.id;

    const publishRes = await threadsClient.post(
      `/${userId}/threads_publish`,
      { creation_id: containerId },
      { params: { access_token: token } }
    );

    return NextResponse.json({ postId: publishRes.data.id });
  } catch (err: unknown) {
    const error = err as { response?: { data: unknown } };
    return NextResponse.json(
      { error: error.response?.data ?? "Threads post failed" },
      { status: 500 }
    );
  }
}
