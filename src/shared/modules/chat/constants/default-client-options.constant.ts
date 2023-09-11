import { Enums } from "@altv/shared";
import type { ClientOptions } from "../interfaces";

export const DefaultClientOptions: ClientOptions = {
  focusKey: Enums.KeyCode.Y,
  hideOnConnect: false,
  maxMessageHistory: 100,
  unfocusKey: Enums.KeyCode.F11,
};
