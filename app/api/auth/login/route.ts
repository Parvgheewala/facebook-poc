import { NextResponse } from "next/server";

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    redirect_uri: process.env.META_REDIRECT_URI!,
    scope: [
      "pages_show_list",
      "pages_manage_posts",
      "pages_read_engagement",
      "pages_read_user_content",
      "instagram_basic",
      "instagram_content_publish",
      "instagram_manage_insights",
      "threads_basic",
      "threads_content_publish",
      "threads_manage_insights",
    ].join(","),
    response_type: "code",
    state: crypto.randomUUID(),
  });

  return NextResponse.redirect(
    `https://www.facebook.com/v22.0/dialog/oauth?${params}`
  );
}
