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
import { BlipType } from "@shared/modules/game/ui/blips";
import { prisma } from "@/core/database";

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

registerCmd("pos", (player, [description]) => {
  if (!isInGame(player)) {
    return;
  }

  prisma.savedPoint
    .create({
      data: {
        pos: player.pos,
        rot: player.rot,
        description,
      },
    })
    .then((point) => {
      player.notify(NotificationType.Success, `Saved point: ${description}`);
      alt.VirtualEntity.create({
        group: vg,
        pos: point.pos,
        streamingDistance: 50,
        initialMeta: {
          // @ts-expect-error
          description,
          entityType: "savedPoint",
        },
      });
    });
});

prisma.savedPoint.findMany().then((points) => {
  points.forEach((point) => {
    alt.VirtualEntity.create({
      group: vg,
      pos: point.pos,
      streamingDistance: 50,
      initialMeta: {
        // @ts-expect-error
        description: point.description,
        entityType: "savedPoint",
      },
    });
  });
});
