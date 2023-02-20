import Embed from "./Embed.js";

const AlertTypes = {
  info: 0x33b5e5,
  success: 0x00c851,
  error: 0xff4444,
  warning: 0xffbb33,
  light: 0xe0e0e0,
  dark: 0x212529,
};
export type AlertType = keyof typeof AlertTypes;

export class Alert extends Embed {
  constructor(type: AlertType, title: string, description = "") {
    super();
    this.setColor(AlertTypes[type]).setTitle(title).setDescription(description);
  }
}

export default {
  Success: Alert.bind(Alert, "success"),
  Warning: Alert.bind(Alert, "warning"),
  Error: Alert.bind(Alert, "error"),
  Info: Alert.bind(Alert, "info"),
  Light: Alert.bind(Alert, "light"),
  Dark: Alert.bind(Alert, "dark"),
};
