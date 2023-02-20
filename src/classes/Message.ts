import path from "path";
import Embed from "./Embed.js";
import File, { FileBasic } from "./File.js";
import MessageActions from "./MessageActions.js";

export interface IMessage {
  id: string;
  type: number;
  content: string;
  channel_id?: string;
  author: {
    bot: boolean;
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
  };
  attachments: Attachment[];
  embeds: Embed[];
  mentions: [];
  mention_roles: [];
  pinned: boolean;
  mention_everyone: boolean;
  tts: boolean;
  timestamp: string;
  edited_timestamp: string | null;
  flags: number;
  components?: [];
  webhook_id?: string;
}

export interface Attachment {
  id?: string | number;
  filename?: string;
  description?: string;
  size?: number;
  url?: string;
  proxy_url?: string;
  width?: number;
  height?: number;
  content_type?: string;
  ephemeral?: boolean;
}

export type AllowedMentionType = "roles" | "users" | "everyone";
export interface AllowedMentions {
  parse?: AllowedMentionType[];
  roles?: [];
  users?: [];
  replied_user?: boolean;
}

export default class Message extends MessageActions {
  username = null as string | null;
  avatar = null as string | null;
  content = "";
  tts = false;
  flags = 0;
  threadName = "";
  files = [] as (FileBasic | File)[];
  embeds = [] as Embed[];
  attachments = [] as Attachment[];
  allowedMentions = {} as AllowedMentions;
  webhook = "";
  threadId!: string | undefined;
  wait!: boolean | undefined;
  id = "";

  /**
   * New message instance
   * @param msgId Used to update/delete/get that message
   */
  constructor(msgId = "") {
    super();
    this.setId(msgId);
  }

  _format() {
    const excludedKeys = [
      "id",
      "allowedMentions",
      "wait",
      "threadId",
      "threadName",
      "avatar",
      "webhook",
      "files",
    ];
    const msg = JSON.parse(JSON.stringify(this));
    msg.avatar_url = this.avatar;
    msg.thread_name = this.threadName;
    msg.allowed_mentions = this.allowedMentions;
    msg.embeds = this.embeds.map((embed) => embed._format());
    excludedKeys.forEach((key) => delete msg[key]);
    return msg;
  }

  setId(msgId: string) {
    this.id = msgId;
    return this;
  }

  waitMessage(enable = true) {
    this.wait = enable;
    return this;
  }

  setThreadId(id: string) {
    this.threadId = id;
    return this;
  }

  setWebhook(url: string) {
    this.webhook = url;
    return this;
  }

  /**
   * Override the default username of the webhook
   */
  setUsername(username: string) {
    this.username = username;
    return this;
  }

  /**
   * Override the default avatar of the webhook
   */
  setAvatar(avatarUrl: string) {
    this.avatar = avatarUrl;
    return this;
  }

  setContent(content: string) {
    this.content = content;
    return this;
  }

  setTts(enable = true) {
    this.tts = enable;
    return this;
  }

  setFlags(flags: number) {
    this.flags = flags;
    return this;
  }

  setThreadName(name: string) {
    this.threadName = name;
    return this;
  }

  setAllowedMentions(data: AllowedMentions) {
    this.allowedMentions = data;
    return this;
  }

  /**
   *
   * @param pathOrFile `Path of file` or `Basic file object` or `File instance` to add
   * @param filename Custom file name
   */
  addFile(pathOrFile: string | FileBasic | File, filename = "") {
    if (typeof pathOrFile == "object") {
      if (!pathOrFile.name) pathOrFile.name = path.basename(pathOrFile.path);
    } else if (typeof pathOrFile == "string" && !filename) {
      filename = path.basename(pathOrFile);
    }

    const file =
      pathOrFile instanceof File || typeof pathOrFile == "object"
        ? pathOrFile
        : { path: pathOrFile, name: filename };

    this.files.push(file);
    return this;
  }

  /**
   * Remove File
   * @param pathOrNameOrFile File path/name (case insensitive) or File instance
   */
  removeFile(pathOrNameOrFile: string | File) {
    const isFileInstance = pathOrNameOrFile instanceof File;
    const fileIndx = this.files.findIndex((file) => {
      if (isFileInstance) {
        return file?.id == pathOrNameOrFile.id;
      } else {
        return (
          file.path.toLowerCase() == pathOrNameOrFile.toLowerCase() ||
          file?.name?.toLowerCase() == pathOrNameOrFile.toLowerCase()
        );
      }
    });
    if (fileIndx > -1) this.files.splice(fileIndx, 1);
    return this;
  }

  addEmbed(embed: Embed) {
    this.embeds.push(embed);
    return this;
  }

  /**
   * Remove Embed
   * @param embed Embed object or Embed Id (case insensitive)
   */
  removeEmbed(embed: Embed | string) {
    const embedId = embed instanceof Embed ? embed.id : embed;
    const embedIndx = this.embeds.findIndex((e) => e.id.toLowerCase() == embedId.toLowerCase());
    if (embedIndx > -1) this.embeds.splice(embedIndx, 1);
    return this;
  }

  addAttachment(attachment: Attachment) {
    this.attachments.push(attachment);
    return this;
  }

  removeAttachment(id: string) {
    const attIndx = this.attachments.findIndex((att) => att.id == id);
    if (attIndx > -1) this.attachments.splice(attIndx, 1);
    return this;
  }
}
