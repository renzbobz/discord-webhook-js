# Discord Webhook JS

⚠️ Will fix soon! BRB.

Documentation, ESModules support, and Browser support soon.

# Installation

```
npm i discord-webhook-js
```

# Usage

```js
const { Webhook, Alert, File, Message, Embed } = require("discord-webhook-js");
```

## Response Object

| Name       |      Type      | Description                                                                             |
| :--------- | :------------: | :-------------------------------------------------------------------------------------- |
| success    |    boolean     | Response code is in 2xx range                                                           |
| data       | object\|string | Response data of successful request. Can be a message/webhook object or an empty string |
| status     |     number     | Status code of response                                                                 |
| statusText |     string     | Status message corresponding to the status code                                         |
| error      |  object\|null  | Request error or discord error                                                          |

## Sample

```js
(async () => {
  const webhook = "";

  const wh = new Webhook(webhook);
  console.log(await wh.post("Hello"));

  const msg = new Message().setContent("Hello").setTts(true);

  console.log(await wh.post(msg));

  const embed = new Embed().setTitle("Hello").setDescription("World");
  msg.addEmbed(embed);
  console.log(await wh.post(msg));

  const file = new File("file.txt");
  msg.addFile(file);
  console.log(await wh.post(msg));

  const alert = new Alert.Success("Success!", "Blah Blah");
  console.log(await alert.send(webhook));
})();
```
