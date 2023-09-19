import * as alt from "@altv/client";
import { CommandSuggestion, MessageType, WindowOptions } from "@shared/modules/chat";
import { bind } from "@shared/decorators";
import { UIElement } from "@shared/enums/ui";
import {
  doesElementHaveCursor,
  getWebview,
  showCursor,
  toggleElement,
} from "@/core/user-interface/webview";
import type { Message } from "../interfaces";

let isFocused = false;

doesElementHaveCursor.hook((element) => {
  if (element !== UIElement.CHAT) {
    return;
  }
  return isFocused;
});

@bind()
export class WindowService {
  private focusEnabled = true;
  private webView!: alt.WebView;

  public constructor() {
    getWebview((webView) => {
      this.webView = webView;
      setTimeout(() => {
        this.show();
      }, 1000);
    });
  }

  public focus() {
    if (!this.webView.visible || !this.focusEnabled) return;
    this.webView.emit("vchat:focus", true);
    this.webView.focused = true;
    isFocused = true;
    alt.setGameControlsActive(false);
    alt.Cursor.visible = true;
  }

  public unfocus() {
    if (!this.webView.visible || !this.focusEnabled) return;
    this.webView.emit("vchat:focus", false);
    this.webView.focused = true;
    isFocused = false;
    alt.setGameControlsActive(true);
    alt.Cursor.visible = false;
  }

  public toggleFocus(value: boolean) {
    value ? this.focus() : this.unfocus();
  }

  public toggleFocusEnabled(enabled: boolean) {
    this.focusEnabled = enabled;
    if (!enabled) this.unfocus();
  }

  public show() {
    toggleElement(UIElement.CHAT, true);
  }

  public hide() {
    toggleElement(UIElement.CHAT, false);
  }

  public addMessage(message: string, type: MessageType = MessageType.Default) {
    this.webView.emit("vchat:addMessage", message, type);
  }

  public loadMessageHistory(messages: Array<Message>) {
    this.webView.emit("vchat:loadMessageHistory", messages);
  }

  public clearMessages() {
    this.webView.emit("vchat:clearMessages");
  }

  public addSuggestion(suggestion: CommandSuggestion | Array<CommandSuggestion>) {
    this.webView.emit("vchat:addSuggestion", suggestion);
  }

  public removeSuggestions() {
    this.webView.emit("vchat:removeSuggestions");
  }

  public syncSettings(options: WindowOptions, commandSuggestions: Array<CommandSuggestion>) {
    this.webView.emit("vchat:syncSettings", options, commandSuggestions);
  }

  public updateOptions(options: WindowOptions) {
    this.webView.emit("vchat:updateOptions", options);
  }

  public on(event: string, listener: (...args: any[]) => void) {
    getWebview((webview) => webview.on(event, listener));
  }

  public once(event: string, listener: (...args: any[]) => void) {
    getWebview((webview) => webview.once(event, listener));
  }
}
