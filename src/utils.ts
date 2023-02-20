export function generateId() {
  return Math.random().toString(36).slice(2);
}

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

export function isValidWebhookUrl(url: string) {
  return /discord(?:app)?\.com\/api\/webhooks\/(\d+)\/(\w+)/.test(url);
}

export function formatWebhook(
  url: string | URL,
  { wait = false, threadId = "", messageId = "" } = {}
) {
  if (!url) return "";
  if (!(url instanceof URL)) url = new URL(url);
  if (wait) url.searchParams.set("wait", String(wait));
  if (threadId) url.searchParams.set("thread_id", threadId);
  if (messageId) url.pathname += "/messages/" + messageId;
  return url.href;
}
