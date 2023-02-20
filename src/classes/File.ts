import fs from "fs";
import path from "path";
// @ts-ignore
import fetch from "node-fetch/lib/index.js";
import { isValidUrl, generateId } from "../utils.js";

export const tmpDir = "./tmp/";

export interface FileBasic {
  id?: string;
  path: string;
  name?: string;
  stream?: any;
}

export default class File {
  name = "";
  path = "";
  web = false;
  stream = null as any;
  id = "";

  /**
   * New file instance
   * @param pathOrUrl File path or url
   * @param name Custom file name
   */
  constructor(pathOrUrl: string, name = "") {
    this.id = generateId();
    this.web = isValidUrl(pathOrUrl);
    this.name = name || path.basename(pathOrUrl);
    this.path = pathOrUrl;
  }

  async load() {
    if (!this.stream) {
      if (this.web) {
        const res = await fetch(this.path);
        this.stream = res.body;
      } else {
        this.stream = fs.createReadStream(this.path);
      }
    }

    return this;
  }
}
