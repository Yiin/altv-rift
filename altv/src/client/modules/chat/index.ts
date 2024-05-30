import { container } from "@shared/dependency-injection";
import { MessageType } from "@shared/modules/chat";
import { Chat } from "./chat";

export const chat = container.resolve(Chat);

chat.start();

export function addChatMessage(message: string) {
  chat.addMessageToWindow(message, MessageType.Default);
}

export function addErrorMessage(message: string) {
  chat.addMessageToWindow(message, MessageType.Error);
}

export function addInfoMessage(message: string) {
  chat.addMessageToWindow(message, MessageType.Info);
}

export function addSuccessMessage(message: string) {
  chat.addMessageToWindow(message, MessageType.Success);
}

export function addWarningMessage(message: string) {
  chat.addMessageToWindow(message, MessageType.Warning);
}
