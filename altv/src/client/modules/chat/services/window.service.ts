import alt from "@altv/client";
import { CommandSuggestion, MessageType, WindowOptions } from "@shared/modules/chat";
import { bind } from "@shared/decorators";
import { UIElement } from "@shared/enums/ui";
import { deserialize } from "@shared/utility/serializer";
import { doesElementHaveCursor, useWebview, toggleElement } from "@/core/user-interface/webview";
import type { Message } from "../interfaces";
import { GameControlReason, disableGameControls, enableGameControls } from "@/core/user-interface/event-helpers";

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
    useWebview((webView) => {
      this.webView = webView;
      setTimeout(() => {
        this.show();
      }, 1000);
    });
  }

  public focus() {
    if (!this.webView.visible || !this.focusEnabled) return;
    this.webView.emitRaw("vchat:focus", true);
    this.webView.focused = true;
    isFocused = true;
    disableGameControls(GameControlReason.CHAT);
    alt.Cursor.visible = true;
  }

  public unfocus() {
    if (!this.webView.visible || !this.focusEnabled) return;
    this.webView.emitRaw("vchat:focus", false);
    this.webView.focused = true;
    isFocused = false;
    enableGameControls(GameControlReason.CHAT);
    alt.Cursor.visible = false;
  }

  public toggleFocus(value: boolean) {
    value ? this.focus() : this.unfocus();
    alt.Events.emit("vchat:focus", value);
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
    this.webView.emitRaw("vchat:addMessage", message, type);
  }

  public loadMessageHistory(messages: Array<Message>) {
    this.webView.emitRaw("vchat:loadMessageHistory", messages);
  }

  public clearMessages() {
    this.webView.emitRaw("vchat:clearMessages");
  }

  public addSuggestion(suggestion: CommandSuggestion | Array<CommandSuggestion>) {
    this.webView.emitRaw("vchat:addSuggestion", suggestion);
  }

  public removeSuggestions() {
    this.webView.emitRaw("vchat:removeSuggestions");
  }

  public syncSettings(options: WindowOptions, commandSuggestions: Array<CommandSuggestion>) {
    this.webView.emitRaw("vchat:syncSettings", options, commandSuggestions);
  }

  public updateOptions(options: WindowOptions) {
    this.webView.emitRaw("vchat:updateOptions", options);
  }

  public on(event: string, listener: (...args: any[]) => void) {
    useWebview((webview) => webview.on(event, (...args) => listener(...args.flatMap(deserialize))));
  }

  public once(event: string, listener: (...args: any[]) => void) {
    useWebview((webview) =>
      webview.once(event, (...args) => listener(...args.flatMap(deserialize))),
    );
  }
}
