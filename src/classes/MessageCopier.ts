import Message from "./Message.js";
import Embed from "./Embed.js";
import File from "./File.js";

export default class MessageCopier {
  webhook = "";
  id = "";

  /**
   * New message copier instance (Set the discord message to Message class)
   * @param webhook Webhook url
   * @param msgId Id of message to copy
   */
  constructor(webhook = "", msgId = "") {
    this.webhook = webhook;
    this.id = msgId;
  }

  /**
   * Copy webhook message
   */
  async copy(this: Message) {
    const getMsgRes = await this.get();

    if (!getMsgRes.success || !getMsgRes.data) {
      throw new Error("MessageCopier.copy | Get Message Error:", { cause: getMsgRes.error });
    }

    const { content, author, embeds, flags, tts, attachments } = getMsgRes.data;

    const username = author.username;
    const avatar = `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png`;

    this.setContent(content).setUsername(username).setAvatar(avatar).setTts(tts).setFlags(flags);

    for (const { url, filename, description } of attachments) {
      if (!url) continue;
      const file = new File(url, filename);
      this.addFile(file);
      const newAttachment = {
        id: this.files.findIndex((file) => file.path == url),
        filename,
        description,
      };
      this.addAttachment(newAttachment);
    }

    for (const {
      url,
      title,
      description,
      color,
      timestamp,
      fields,
      author,
      image,
      thumbnail,
      footer,
    } of embeds) {
      const embed = new Embed();
      if (title) embed.setTitle(title, url);
      if (description) embed.setDescription(description);
      if (color) embed.setColor(color);
      if (timestamp) embed.setTimestamp(timestamp);
      if (fields?.length) fields.forEach((field) => embed.addField(field));
      if (author) embed.setAuthor(author);
      if (thumbnail) embed.setThumbnail(thumbnail);
      if (image) embed.setImage(image);
      if (footer) embed.setFooter(footer);
      this.addEmbed(embed);
    }

    return this;
  }
}
