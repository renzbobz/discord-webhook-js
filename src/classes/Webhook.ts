import fs from "fs";
import FormData from "form-data";
import Message, { IMessage } from "./Message.js";
import Fetcher, { FetcherOptions, FetchMethod } from "./Fetcher.js";
import File, { FileBasic } from "./File.js";

export interface WebhookQuery {
  wait?: boolean;
  threadId?: string;
}

export enum WebhookType {
  Incoming = 1,
  ChannelFollower = 2,
  Application = 3,
}

export interface IWebhook {
  id: number;
  type: WebhookType;
  name: string;
  avatar?: string;
  application_id: number;
  token?: string;
  guild_id?: number;
  channel_id?: number;
}

export interface PostOpts extends WebhookQuery {
  method?: Extract<FetchMethod, "POST" | "PATCH">;
}

export default class Webhook {
  /**
   * New webhook instance
   * @param url Webhook url
   * @param opts Options for webhook url query
   */
  constructor(public url: string, public opts?: WebhookQuery) {}

  #_fetch<ResponseDataType = any>(
    method: FetchMethod,
    opts: FetcherOptions & { url?: string } = {}
  ) {
    const webhook = opts.url || this.url;
    return Fetcher<ResponseDataType>(method, webhook, opts);
  }

  async #_getFileData(file: FileBasic | File) {
    if (file instanceof File) {
      if (!file.stream) await file.load();
    } else {
      file.stream ??= fs.createReadStream(file.path);
    }
    return file;
  }

  /**
   * New Message instance with webhook already set
   */
  newMessage(msgId = "") {
    const msg = new Message(msgId).setWebhook(this.url);
    if (typeof this.opts?.wait != "undefined") msg.waitMessage(this.opts.wait);
    if (typeof this.opts?.threadId != "undefined") msg.setThreadId(this.opts.threadId);
    return msg;
  }

  /**
   * Post webhook message
   * @param msg Message instance or content string
   */
  async post(msg: string | Message, opts?: PostOpts) {
    let body, headers: {};

    if (msg instanceof Message) {
      if (!msg.content && !msg.embeds?.length && !msg.files?.length) {
        throw new Error(
          "Cannot send an empty message. Please provide at least one of content, embeds, or file."
        );
      }
    } else if (typeof msg == "string") {
      msg = new Message().setContent(msg);
    }

    const payloadJSON = JSON.stringify(msg._format());

    if (msg.files?.length) {
      const formData = new FormData();
      const files = msg.files;
      const filesData = await Promise.all(files.map((file) => this.#_getFileData(file)));

      filesData.forEach((file, indx: number) => {
        formData.append(`files[${indx}]`, file.stream, { filename: file.name });
      });
      formData.append("payload_json", payloadJSON);

      body = formData;
      headers = formData.getHeaders();
    } else {
      body = payloadJSON;
      headers = {
        "Content-type": "application/json",
      };
    }

    const msgOpts: WebhookQuery = {};
    if (typeof msg.wait != "undefined") msgOpts.wait = msg.wait;
    if (typeof msg.threadId != "undefined") msgOpts.threadId = msg.threadId;

    return this.#_fetch<IMessage>(
      opts?.method || "POST",
      Object.assign(
        {
          url: this.url,
          body,
          headers,
        },
        opts || { ...(this.opts || {}), ...msgOpts }
      )
    );
  }

  /**
   * Delete webhook permanently
   */
  delete() {
    return this.#_fetch("DELETE");
  }

  /**
   * Update webhook
   * @param name New default webhook name
   * @param avatar New default webhook avatar (must be an image data)
   */
  update(name?: string, avatar?: string) {
    return this.#_fetch<IWebhook>("PATCH", {
      body: JSON.stringify({ name, avatar }),
      headers: { "content-type": "application/json" },
    });
  }

  /**
   * Get webhook info
   */
  get() {
    return this.#_fetch<IWebhook>("GET");
  }
}
