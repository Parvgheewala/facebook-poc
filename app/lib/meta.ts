import axios from "axios";

export const GRAPH_BASE = "https://graph.facebook.com/v22.0";

export const graphClient = axios.create({
  baseURL: GRAPH_BASE,
  timeout: 10000,
});

export function getPageToken(): string {
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!token) throw new Error("META_PAGE_ACCESS_TOKEN not set");
  return token;
}

export function getUserToken(): string {
  const token = process.env.META_USER_ACCESS_TOKEN;
  if (!token) throw new Error("META_USER_ACCESS_TOKEN not set");
  return token;
}

export function getPageId(): string {
  const id = process.env.META_PAGE_ID;
  if (!id) throw new Error("META_PAGE_ID not set");
  return id;
}

export function getIgAccountId(): string {
  const id = process.env.META_IG_ACCOUNT_ID;
  if (!id) throw new Error("META_IG_ACCOUNT_ID not set");
  return id;
}
