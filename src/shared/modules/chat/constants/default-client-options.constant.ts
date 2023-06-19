import { KeyCode } from "altv-enums";
import type { ClientOptions } from "../interfaces";

export const DefaultClientOptions: ClientOptions = {
  focusKey: KeyCode.Y,
  hideOnConnect: false,
  maxMessageHistory: 100,
  unfocusKey: KeyCode.F11,
};
