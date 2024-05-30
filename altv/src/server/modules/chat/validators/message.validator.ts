import { logError } from "@altv/server";
import { MessageType } from "@shared/modules/chat";

export function validateMessage(message: string, type: MessageType): boolean {
  if (typeof message !== "string") {
    logError(`[vchat:send] Message is not a string: ${message}`);
    return false;
  }
  if (!MessageType.hasOwnProperty(type)) {
    logError(`[vchat:send] Unknown message type: ${type}`);
    return false;
  }

  return true;
}
