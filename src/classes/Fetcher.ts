// @ts-ignore
import fetch from "node-fetch/lib/index.js";
import type { RequestInit } from "node-fetch";
import { formatWebhook, isValidWebhookUrl } from "../utils.js";

export type FetchMethod = "GET" | "POST" | "PATCH" | "DELETE";

export interface FetcherOptions extends RequestInit {
  wait?: boolean;
  threadId?: string;
  messageId?: string;
}

export default async function Fetcher<ResponseDataType = any>(
  method: FetchMethod,
  webhook: string,
  opts: FetcherOptions = {}
) {
  const output = {
    success: false,
    data: null as ResponseDataType,
    status: null,
    statusText: null,
    error: null,
  };

  if (!webhook) throw new Error("Please enter Discord webhook URL.");
  if (!isValidWebhookUrl(webhook)) throw new Error("Please enter a valid Discord webhook URL.");

  webhook = formatWebhook(webhook, {
    wait: opts.wait,
    threadId: opts.threadId,
    messageId: opts.messageId,
  });

  try {
    const res = await fetch(webhook, {
      method,
      ...opts,
    });

    Object.assign(output, {
      success: res.ok,
      status: res.status,
      statusText: res.statusText,
    });

    let data = "" as unknown;
    if (res.status != 204) data = await res.json();
    if (!res.ok) throw data;

    Object.assign(output, { data });
  } catch (error) {
    Object.assign(output, { error });
  }

  return output;
}
