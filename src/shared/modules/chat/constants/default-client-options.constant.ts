import { KeyCode } from "altv-enums";
import type { ClientOptions } from "../interfaces";

export const DefaultClientOptions: ClientOptions = {
  focusKey: KeyCode.F10,
  hideOnConnect: false,
  maxMessageHistory: 100,
  unfocusKey: KeyCode.F11,
};
