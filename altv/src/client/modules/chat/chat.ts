import alt from "@altv/client";
import { inject } from "inversify";
import { bind } from "@shared/decorators";
import { ClientOptions, CommandSuggestion, MessageType, WindowOptions } from "@shared/modules/chat";
import { WindowService, EventService, MessageHistoryService, OptionsService } from "./services";
import { onKeyDown } from "@/core/user-interface/event-helpers";

@bind()
export class Chat {
  public constructor(
    @inject(EventService)
    private readonly eventService: EventService,
    @inject(MessageHistoryService)
    private readonly messageHistoryService: MessageHistoryService,
    @inject(OptionsService) private readonly optionsService: OptionsService,
    @inject(WindowService) private readonly windowService: WindowService,
  ) { }

  public start() {
    this.eventService.onServer("vchat:toggleVisibility", this.toggleWindowVisibility.bind(this));
    this.eventService.onServer("vchat:toggleFocus", this.toggleWindowFocus.bind(this));
    this.eventService.onServer(
      "vchat:toggleFocusEnabled",
      this.toggleWindowFocusEnabled.bind(this),
    );
    this.eventService.onServer("vchat:addMessage", this.addMessageToWindow.bind(this));
    this.eventService.onServer("vchat:addSuggestion", this.addSuggestionToWindow.bind(this));
    this.eventService.onServer(
      "vchat:removeSuggestions",
      this.removeSuggestionsFromWindow.bind(this.windowService),
    );
    this.eventService.onServer("vchat:clearMessages", this.clearWindowMessages.bind(this));
    this.eventService.onServer("vchat:clearMessageHistory", this.clearMessageHistory.bind(this));
    this.eventService.onServer("vchat:syncSettings", this.syncSettings.bind(this));
    this.eventService.onServer("vchat:updateOption", this.updateOption.bind(this));
    this.eventService.onServer("vchat:updateOptions", this.updateOptions.bind(this));

    onKeyDown(alt.Enums.KeyCode.Y, () => this.windowService.focus());
    onKeyDown(alt.Enums.KeyCode.F11, () => this.windowService.unfocus());

    this.windowService.on("vchat:requestSettings", this.requestSettings.bind(this));
    this.windowService.once("vchat:mounted", this.markAsMounted.bind(this));
    this.windowService.on("vchat:addMessage", this.sendMessageToServer.bind(this));
  }

  public toggleWindowVisibility(enabled: boolean) {
    enabled ? this.windowService.show() : this.windowService.hide();
  }

  public toggleWindowFocus(enabled: boolean) {
    this.windowService.toggleFocus(enabled);
  }

  public toggleWindowFocusEnabled(enabled: boolean) {
    this.windowService.toggleFocusEnabled(enabled);
  }

  public addMessageToWindow(message: string, type: MessageType = MessageType.Default) {
    if (this.messageHistoryService.getLength() > this.optionsService.get("maxMessageHistory"))
      this.messageHistoryService.removeFirst();
    this.messageHistoryService.add({ content: message, type });
    this.windowService.addMessage(message, type);
  }

  public addSuggestionToWindow(suggestion: CommandSuggestion | Array<CommandSuggestion>) {
    this.windowService.addSuggestion(suggestion);
  }

  public removeSuggestionsFromWindow() {
    this.windowService.removeSuggestions();
  }

  public clearWindowMessages() {
    this.windowService.clearMessages();
  }

  public clearMessageHistory() {
    this.messageHistoryService.clear();
  }

  public syncSettings(
    options: ClientOptions & WindowOptions,
    commandSuggestions: Array<CommandSuggestion>,
  ) {
    this.optionsService.update(options);

    this.windowService.syncSettings(this.optionsService.getWindowOptions(), commandSuggestions);
  }

  public updateOption(
    key: keyof ClientOptions & WindowOptions,
    value: (ClientOptions & WindowOptions)[keyof (ClientOptions & WindowOptions)],
  ) {
    this.optionsService.set(key, value);
    this.windowService.updateOptions(this.optionsService.getWindowOptions());
  }

  public updateOptions(options: Partial<ClientOptions & WindowOptions>) {
    this.optionsService.update(options);
    this.windowService.updateOptions(this.optionsService.getWindowOptions());
  }

  public requestSettings() {
    this.windowService.loadMessageHistory(this.messageHistoryService.get());
    this.eventService.emitServerRaw("vchat:requestSettings");
  }

  public markAsMounted() {
    this.optionsService.get("hideOnConnect")
      ? this.windowService.hide()
      : this.windowService.show();
    this.eventService.emitServerRaw("vchat:mounted", true);
  }

  public sendMessageToServer(message: string) {
    if (message.length > 0) this.eventService.emitServerRaw("vchat:sendMessage", message);
    this.windowService.unfocus();
  }
}
