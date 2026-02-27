"use client";

import { useState } from "react";

type Platform = "facebook" | "instagram" | "threads";
type Tab = "connect" | "post" | "insights";

interface PostForm {
  platform: Platform;
  message: string;
  imageUrl: string;
  link: string;
}

interface InsightResult {
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
  [key: string]: number;
}

const PLATFORM_CONFIG = {
  facebook: {
    label: "Facebook",
    color: "#1877F2",
    bg: "#EBF3FF",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  instagram: {
    label: "Instagram",
    color: "#E1306C",
    bg: "#FEF0F5",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  threads: {
    label: "Threads",
    color: "#000000",
    bg: "#F5F5F5",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.751-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.288-.883-2.301-.887h-.051c-.8 0-1.821.199-2.526 1.254l-1.712-1.174c.858-1.304 2.284-2.028 4.17-2.049 1.57.017 2.805.474 3.67 1.36 1.077 1.105 1.404 2.634 1.573 4.066l.074.671c.05.451.078.963.078 1.52 0 .557-.028 1.069-.078 1.52-.098.88-.28 1.722-.54 2.508-.78 2.327-2.614 4.047-5.494 4.047-.084 0-.168-.002-.252-.006h-.006Z"/>
      </svg>
    ),
  },
};

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-semibold text-stone-800 tabular-nums">
        {value.toLocaleString()}
      </div>
      <div className="text-xs text-stone-400 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-stone-900 text-white shadow-sm"
          : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
      }`}
    >
      {children}
    </button>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("connect");
  const [connected, setConnected] = useState(false);
  const [postForm, setPostForm] = useState<PostForm>({
    platform: "facebook",
    message: "",
    imageUrl: "",
    link: "",
  });
  const [postLoading, setPostLoading] = useState(false);
  const [postResult, setPostResult] = useState<{ postId?: string; mediaId?: string; error?: string } | null>(null);

  const [insightPlatform, setInsightPlatform] = useState<Platform>("facebook");
  const [insightId, setInsightId] = useState("");
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightResult, setInsightResult] = useState<InsightResult | null>(null);
  const [insightError, setInsightError] = useState<string | null>(null);

  const handleConnect = () => {
    window.location.href = "/api/auth/login";
  };

  const handlePost = async () => {
    setPostLoading(true);
    setPostResult(null);
    try {
      let endpoint = "";
      let body: Record<string, string> = {};

      if (postForm.platform === "facebook") {
        endpoint = "/api/facebook/post";
        body = { message: postForm.message, ...(postForm.link && { link: postForm.link }) };
      } else if (postForm.platform === "instagram") {
        endpoint = "/api/instagram/post";
        body = { imageUrl: postForm.imageUrl, caption: postForm.message };
      } else {
        endpoint = "/api/threads/post";
        body = {
          text: postForm.message,
          mediaType: postForm.imageUrl ? "IMAGE" : "TEXT",
          ...(postForm.imageUrl && { imageUrl: postForm.imageUrl }),
        };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setPostResult(data);
    } catch {
      setPostResult({ error: "Request failed" });
    } finally {
      setPostLoading(false);
    }
  };

  const handleInsights = async () => {
    if (!insightId.trim()) return;
    setInsightLoading(true);
    setInsightResult(null);
    setInsightError(null);
    try {
      const endpointMap: Record<Platform, string> = {
        facebook: `/api/facebook/insights/${insightId}`,
        instagram: `/api/instagram/insights/${insightId}`,
        threads: `/api/threads/insights/${insightId}`,
      };
      const res = await fetch(endpointMap[insightPlatform]);
      const data = await res.json();
      if (data.error) setInsightError(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
      else setInsightResult(data);
    } catch {
      setInsightError("Request failed");
    } finally {
      setInsightLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-stone-900 tracking-tight">Meta POC</h1>
            <p className="text-xs text-stone-400 mt-0.5" style={{ fontFamily: "monospace" }}>
              facebook · instagram · threads
            </p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${connected ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-stone-400"}`} />
            {connected ? "Connected" : "Not connected"}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-1 bg-stone-100 p-1 rounded-2xl w-fit mb-10">
          <TabButton active={activeTab === "connect"} onClick={() => setActiveTab("connect")}>Connect</TabButton>
          <TabButton active={activeTab === "post"} onClick={() => setActiveTab("post")}>Post</TabButton>
          <TabButton active={activeTab === "insights"} onClick={() => setActiveTab("insights")}>Insights</TabButton>
        </div>

        {/* ── CONNECT TAB ── */}
        {activeTab === "connect" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-stone-900 mb-2">Connect your Meta account</h2>
              <p className="text-stone-500 text-sm leading-relaxed max-w-md">
                Authorize this app to post and read engagement data from your Facebook Page,
                Instagram Business account, and Threads profile.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {(Object.entries(PLATFORM_CONFIG) as [Platform, typeof PLATFORM_CONFIG.facebook][]).map(([key, cfg]) => (
                <div key={key} className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                    {cfg.icon}
                  </div>
                  <div className="text-sm font-medium text-stone-800">{cfg.label}</div>
                  <div className="text-xs text-stone-400 mt-1">Post · Insights</div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="text-sm font-medium text-stone-700">Permissions requested</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "pages_manage_posts",
                  "pages_read_engagement",
                  "instagram_content_publish",
                  "instagram_manage_insights",
                  "threads_content_publish",
                  "threads_manage_insights",
                ].map((scope) => (
                  <div key={scope} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-stone-300 shrink-0" />
                    <span className="text-xs text-stone-500" style={{ fontFamily: "monospace" }}>{scope}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleConnect}
              className="w-full bg-stone-900 text-white py-3.5 rounded-2xl text-sm font-medium hover:bg-stone-800 active:scale-[0.99] transition-all duration-150 shadow-sm"
            >
              Connect with Meta →
            </button>
          </div>
        )}

        {/* ── POST TAB ── */}
        {activeTab === "post" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-stone-900 mb-2">Create a post</h2>
              <p className="text-stone-500 text-sm">Publish content to your connected accounts.</p>
            </div>

            {/* Platform selector */}
            <div className="flex gap-2">
              {(Object.entries(PLATFORM_CONFIG) as [Platform, typeof PLATFORM_CONFIG.facebook][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setPostForm((f) => ({ ...f, platform: key }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
                    postForm.platform === key
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                  }`}
                >
                  <span style={{ color: postForm.platform === key ? "white" : cfg.color }}>{cfg.icon}</span>
                  {cfg.label}
                </button>
              ))}
            </div>

            <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <label className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-2">
                  {postForm.platform === "facebook" ? "Message" : postForm.platform === "instagram" ? "Caption" : "Text"}
                </label>
                <textarea
                  rows={4}
                  value={postForm.message}
                  onChange={(e) => setPostForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder={postForm.platform === "threads" ? "What's on your mind?" : "Write something..."}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent resize-none transition"
                />
              </div>

              {(postForm.platform === "instagram" || postForm.platform === "threads") && (
                <div>
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-2">Image URL</label>
                  <input
                    type="url"
                    value={postForm.imageUrl}
                    onChange={(e) => setPostForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition"
                  />
                  {postForm.platform === "instagram" && (
                    <p className="text-xs text-stone-400 mt-1.5">Must be a publicly accessible URL</p>
                  )}
                </div>
              )}

              {postForm.platform === "facebook" && (
                <div>
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-2">Link (optional)</label>
                  <input
                    type="url"
                    value={postForm.link}
                    onChange={(e) => setPostForm((f) => ({ ...f, link: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition"
                  />
                </div>
              )}

              <button
                onClick={handlePost}
                disabled={postLoading || !postForm.message}
                className="w-full bg-stone-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] transition-all duration-150"
              >
                {postLoading ? "Publishing..." : `Publish to ${PLATFORM_CONFIG[postForm.platform].label}`}
              </button>
            </div>

            {postResult && (
              <div className={`rounded-2xl p-5 text-sm border ${postResult.error ? "bg-red-50 border-red-100 text-red-700" : "bg-emerald-50 border-emerald-100 text-emerald-700"}`}>
                {postResult.error ? (
                  <><span className="font-medium">Error: </span>{JSON.stringify(postResult.error)}</>
                ) : (
                  <><span className="font-medium">Published! </span>ID: <span style={{ fontFamily: "monospace" }}>{postResult.postId ?? postResult.mediaId}</span></>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── INSIGHTS TAB ── */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-stone-900 mb-2">Engagement insights</h2>
              <p className="text-stone-500 text-sm">Fetch metrics for any post by its ID.</p>
            </div>

            <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex gap-2">
                {(Object.entries(PLATFORM_CONFIG) as [Platform, typeof PLATFORM_CONFIG.facebook][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => { setInsightPlatform(key); setInsightResult(null); setInsightError(null); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
                      insightPlatform === key
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    <span style={{ color: insightPlatform === key ? "white" : cfg.color }}>{cfg.icon}</span>
                    {cfg.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-2">
                  {insightPlatform === "instagram" ? "Media ID" : "Post ID"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={insightId}
                    onChange={(e) => setInsightId(e.target.value)}
                    placeholder="e.g. 123456789_987654321"
                    className="flex-1 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition"
                    style={{ fontFamily: "monospace" }}
                  />
                  <button
                    onClick={handleInsights}
                    disabled={insightLoading || !insightId.trim()}
                    className="px-5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
                  >
                    {insightLoading ? "..." : "Fetch"}
                  </button>
                </div>
              </div>
            </div>

            {insightError && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-sm text-red-700">
                <span className="font-medium">Error: </span>{insightError}
              </div>
            )}

            {insightResult && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <StatCard label="Likes" value={insightResult.likes ?? 0} icon="♥" />
                  <StatCard label="Comments" value={insightResult.comments ?? insightResult.replies ?? 0} icon="💬" />
                  <StatCard label="Shares" value={insightResult.shares ?? insightResult.reposts ?? 0} icon="↗" />
                  <StatCard label="Reach" value={insightResult.reach ?? 0} icon="◎" />
                  <StatCard label="Impressions" value={insightResult.impressions ?? insightResult.views ?? 0} icon="◈" />
                  {insightResult.saved !== undefined && (
                    <StatCard label="Saved" value={insightResult.saved} icon="⊡" />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}