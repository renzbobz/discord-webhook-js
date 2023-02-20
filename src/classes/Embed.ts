import { generateId } from "../utils.js";
import Message from "./Message.js";
import { SendOpts } from "./MessageActions.js";

export interface Author {
  name: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface Thumbnail {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface Image {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface Footer {
  text: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface Field {
  name: string;
  value?: string;
  inline?: boolean;
}

export default class Embed {
  title = "";
  url = "";
  description = "";
  color = 0;
  timestamp = "";
  author = {} as Author;
  thumbnail = {} as Thumbnail;
  image = {} as Image;
  footer = {} as Footer;
  fields = [] as Field[];
  id = "";

  /**
   * New embed instance
   * @param embedId (auto-generated) Used when removing embed
   */
  constructor(embedId?: string) {
    this.id = embedId || generateId();
  }

  _format() {
    const excludedKeys = ["id"];
    const embed = JSON.parse(JSON.stringify(this));
    excludedKeys.forEach((key) => delete embed[key]);
    return embed;
  }

  setTitle(title: string, url?: string) {
    this.title = title;
    if (url) this.setUrl(url);
    return this;
  }

  setUrl(url: string) {
    this.url = url;
    return this;
  }

  setDescription(desc: string) {
    this.description = desc;
    return this;
  }

  setColor(color: number) {
    this.color = color;
    return this;
  }

  setRandomColor() {
    this.color = Math.floor(Math.random() * 16777215);
    return this;
  }

  setTimestamp(ts?: string) {
    this.timestamp = ts ?? new Date().toISOString();
    return this;
  }

  setAuthor(name: string | Author, url?: string, icon_url?: string, proxy_icon_url?: string) {
    this.author = typeof name == "object" ? name : { name, url, icon_url, proxy_icon_url };
    return this;
  }

  setThumbnail(url: string | Thumbnail, proxy_url?: string, height?: number, width?: number) {
    this.thumbnail = typeof url == "object" ? url : { url, proxy_url, height, width };
    return this;
  }

  setImage(url: string | Image, proxy_url?: string, height?: number, width?: number) {
    this.image = typeof url == "object" ? url : { url, proxy_url, height, width };
    return this;
  }

  setFooter(text: string | Footer, icon_url?: string, proxy_icon_url?: string) {
    this.footer = typeof text == "object" ? text : { text, icon_url, proxy_icon_url };
    return this;
  }

  addField(name: string | Field, value?: string, inline?: boolean) {
    const field = typeof name == "object" ? name : { name, value, inline };
    this.fields.push(field);
    return this;
  }

  /**
   * Remove Field
   * @param name Field name (case insensitive)
   */
  removeField(name: string) {
    const fieldToDeleteIndx = this.fields.findIndex(
      (field) => field.name.toLowerCase() == name.toLowerCase()
    );
    if (fieldToDeleteIndx > -1) this.fields.splice(fieldToDeleteIndx, 1);
    return this;
  }

  /**
   * Send embed only message directly (shorthand method)
   * @param webhook `Webhook url` or `Options object`
   * @param opts `Options object`
   */
  send(webhook: string | SendOpts, opts?: SendOpts) {
    return new Message().addEmbed(this).send(webhook, opts);
  }
}
