import alt from "@altv/server";
import { registerCmd, sendChatMessage } from "../chat";
import "./v1";
import { isInGame } from "@/core/utility/assertions";
import {
  BlueprintKey,
  FirearmWeaponBlueprint,
  isItemKeyUnlearnedBlueprint,
} from "@shared/modules/production";
import { MessageType } from "@shared/modules/chat";

const vg = alt.VirtualEntityGroup.create({ maxEntitiesInStream: 50 });

registerCmd("blueprint", (player, [blueprint]) => {
  if (!isInGame(player)) {
    return;
  }

  if (!isItemKeyUnlearnedBlueprint(`blueprint_${blueprint}`)) {
    sendChatMessage(
      player,
      `Invalid blueprint: ${blueprint}, needed ${FirearmWeaponBlueprint.APPISTOL}`,
      MessageType.Error,
    );
    return;
  }

  player.addBlueprint(blueprint as BlueprintKey);
});
