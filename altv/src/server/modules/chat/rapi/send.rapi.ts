import { Player } from "@altv/server";
import { MessageType } from "@shared/modules/chat";
import { container } from "@shared/dependency-injection";
import { MountService } from "../services/mount.service";
import { WindowService } from "../services/window.service";
import { OptionsService } from "../services";
import { Chat } from "../chat";
import { CHAT_PLAYER_NAME_METADATA } from "../consts";

/**
 * Sends a message to the player.
 */
export function sendChatMessage(
  player: Player,
  message: string,
  type: MessageType = MessageType.Default,
) {
  const useChatFormattingInAPI = container
    .resolve(OptionsService)
    .getOption("useChatFormattingInAPI");
  if (useChatFormattingInAPI) message = container.resolve(Chat).processMessage(message);

  container
    .resolve(MountService)
    .waitForMount(player, container.resolve(WindowService).send(player, message, type));
}

/**
 * Sends a message to all players.
 */
export function broadcast(message: string, type: MessageType = MessageType.Default) {
  Player.all.forEach((player) => sendChatMessage(player, message, type));
}
