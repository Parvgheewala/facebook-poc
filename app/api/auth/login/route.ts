import { NextResponse } from "next/server";

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    redirect_uri: process.env.META_REDIRECT_URI!,
    scope: [
      "pages_show_list",
      "pages_manage_posts",
      "pages_read_engagement",
    ].join(","),
    response_type: "code",
    state: crypto.randomUUID(),
  });

  return NextResponse.redirect(
    `https://www.facebook.com/v22.0/dialog/oauth?${params}`
  );
}