import Webhook, { PostOpts, WebhookQuery } from "./Webhook.js";
import Fetcher, { FetcherOptions, FetchMethod } from "./Fetcher.js";
import MessageCopier from "./MessageCopier.js";
import Message, { IMessage } from "./Message.js";

export interface SendOpts extends WebhookQuery {
  webhook?: string;
}

export default class MessageActions extends MessageCopier {
  id!: string;
  webhook!: string;
  threadId!: string | undefined;

  constructor() {
    super();
  }

  #_fetch<ResponseDataType = any>(method: FetchMethod, opts: FetcherOptions = {}) {
    const url = this.webhook;
    if (typeof this.threadId != "undefined") opts.threadId = this.threadId;
    return Fetcher<ResponseDataType>(method, url, opts);
  }

  /**
   * Send webhook message (shorthand method)
   * @param webhook `Webhook url` or `Options object`
   * @param opts `Options object`
   */
  send(this: Message, webhook?: string | SendOpts, opts?: SendOpts) {
    opts = typeof webhook == "object" ? webhook : opts;
    if (webhook) {
      webhook = typeof webhook == "object" ? webhook.webhook || this.webhook : webhook;
    } else {
      webhook = opts?.webhook || this.webhook;
    }
    return new Webhook(webhook as string, opts).post(this, opts);
  }

  /**
   * Edit previously-sent webhook message from the same token
   * @param newMsg New message object or else this current message instance will be used
   */
  update(this: Message, newMsg?: Message) {
    const url = this.webhook;
    const msg = newMsg ? newMsg : this;
    const opts: PostOpts = { method: "PATCH" };
    if (typeof this.threadId != "undefined") opts.threadId = this.threadId;
    return new Webhook(url).post(msg, opts);
  }

  /**
   * Get previously-sent webhook message from the same token
   */
  get() {
    return this.#_fetch<IMessage>("GET");
  }

  /**
   * Delete message that was created by the webhook
   */
  delete() {
    return this.#_fetch("DELETE");
  }
}
