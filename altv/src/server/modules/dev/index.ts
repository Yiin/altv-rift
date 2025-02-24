import alt from "@altv/server";
import { registerCmd } from "../chat";
import "./v1";
import { isInGame } from "@/core/utility/assertions";
import {
  BlueprintKey,
  FirearmWeaponBlueprint,
  isItemKeyUnlearnedBlueprint,
} from "@shared/modules/production";
import { NotificationType } from "@shared/interfaces";

const vg = alt.VirtualEntityGroup.create({ maxEntitiesInStream: 50 });

registerCmd("blueprint", (player, [blueprint]) => {
  if (!isInGame(player)) {
    return;
  }

  if (!isItemKeyUnlearnedBlueprint(`blueprint_${blueprint}`)) {
    player.notify(
      NotificationType.Error,
      `Invalid blueprint: ${blueprint}, needed ${FirearmWeaponBlueprint.APPISTOL}`,
    );
    return;
  }

  player.addBlueprint(blueprint as BlueprintKey);
});
