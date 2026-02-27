import { NextRequest, NextResponse } from "next/server";
import { graphClient } from "@/app/lib/meta";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code returned" }, { status: 400 });
  }

  try {
    const shortLivedRes = await graphClient.get("/oauth/access_token", {
      params: {
        client_id: process.env.META_APP_ID,
        redirect_uri: process.env.META_REDIRECT_URI,
        client_secret: process.env.META_APP_SECRET,
        code,
      },
    });
    const shortLivedToken: string = shortLivedRes.data.access_token;

    const longLivedRes = await graphClient.get("/oauth/access_token", {
      params: {
        grant_type: "fb_exchange_token",
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        fb_exchange_token: shortLivedToken,
      },
    });
    const longLivedToken: string = longLivedRes.data.access_token;

    const pagesRes = await graphClient.get("/me/accounts", {
      params: { access_token: longLivedToken },
    });
    const pages: Array<{ id: string; name: string; access_token: string }> =
      pagesRes.data.data;

    const pageId = pages[0]?.id;
    const pageToken = pages[0]?.access_token;

    const igRes = await graphClient.get(`/${pageId}`, {
      params: {
        fields: "instagram_business_account",
        access_token: pageToken,
      },
    });
    const igAccountId = igRes.data.instagram_business_account?.id;

    console.log("=== COPY THESE TO .env.local ===");
    console.log("META_USER_ACCESS_TOKEN=", longLivedToken);
    console.log("META_PAGE_ID=", pageId);
    console.log("META_PAGE_ACCESS_TOKEN=", pageToken);
    console.log("META_IG_ACCOUNT_ID=", igAccountId);

    return NextResponse.json({
      message: "Auth successful. Check server console for tokens.",
      page: pages[0]?.name,
      igAccountId,
    });
  } catch (err: unknown) {
    const error = err as { response?: { data: unknown } };
    return NextResponse.json(
      { error: error.response?.data ?? "Auth failed" },
      { status: 500 }
    );
  }
}
