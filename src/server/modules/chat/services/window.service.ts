import { Player } from "@altv/server";
import { ClientOptions, MessageType, WindowOptions } from "@shared/modules/chat";
import { bind } from "@shared/decorators";
import { validateMessage } from "../validators";

@bind()
export class WindowService {
  private readonly mutedPlayers = new Set<Player>();

  public send(player: Player, message: string, type: MessageType = MessageType.Default) {
    if (!validateMessage(message, type)) return;
    return () => player.emit("vchat:addMessage", message, type);
  }

  public show(player: Player) {
    return () => player.emit("vchat:toggleVisibility", true);
  }

  public hide(player: Player) {
    return () => player.emit("vchat:toggleVisibility", false);
  }

  public mute(player: Player) {
    this.mutedPlayers.add(player);
  }

  public unmute(player: Player) {
    this.mutedPlayers.delete(player);
  }

  public isMuted(player: Player) {
    return this.mutedPlayers.has(player);
  }

  public toggleFocusEnabled(player: Player, enabled: boolean) {
    return () => player.emit("vchat:toggleFocusEnabled", enabled);
  }

  public focus(player: Player) {
    return () => player.emit("vchat:toggleFocus", true);
  }

  public unfocus(player: Player) {
    return () => player.emit("vchat:toggleFocus", false);
  }

  public clearMessageHistory(player: Player) {
    return () => player.emit("vchat:clearMessageHistory");
  }

  public clearMessages(player: Player) {
    return () => player.emit("vchat:clearMessages");
  }

  public updateOption(
    player: Player,
    key: keyof (ClientOptions & WindowOptions),
    value: (ClientOptions & WindowOptions)[keyof (ClientOptions & WindowOptions)]
  ) {
    return () => player.emit("vchat:updateOption", key, value);
  }

  public updateOptions(player: Player, options: Partial<ClientOptions & WindowOptions>) {
    return () => player.emit("vchat:updateOptions", options);
  }
}
