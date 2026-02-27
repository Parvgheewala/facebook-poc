export interface MetaApiError {
  error: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}

export interface FBPostPayload {
  message: string;
  link?: string;
}

export interface IGPostPayload {
  imageUrl: string;
  caption?: string;
}

export interface ThreadsPostPayload {
  text: string;
  mediaType?: "TEXT" | "IMAGE" | "VIDEO";
  imageUrl?: string;
}

export interface PostEngagement {
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
}
