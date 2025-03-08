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
import { prisma } from "@/core/database";

const vg = alt.VirtualEntityGroup.create({ maxEntitiesInStream: 50 });

registerCmd("notification", (player, [type, ...messageParts]) => {
  if (!isInGame(player)) {
    return;
  }

  const message = messageParts.join(" ");

  if (Object.values(NotificationType).includes(type as NotificationType)) {
    player.notify(type as NotificationType, message);
  } else {
    player.notify(NotificationType.Error, `Invalid notification type: ${type}`);
  }
});

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

registerCmd("pos", (player, [...args]) => {
  if (!isInGame(player)) {
    return;
  }

  const description = args.join(" ");

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

      const ve = alt.VirtualEntity.create({
        group: vg,
        pos: point.pos,
        streamingDistance: 50,
      });

      // @ts-expect-error
      ve.streamSyncedMeta.entityType = "savedPoint";
      ve.streamSyncedMeta.description = description;
    });
});

prisma.savedPoint.findMany().then((points) => {
  points.forEach((point) => {
    const ve = alt.VirtualEntity.create({
      group: vg,
      pos: point.pos,
      streamingDistance: 50,
    });

    // @ts-expect-error
    ve.streamSyncedMeta.entityType = "savedPoint";
    ve.streamSyncedMeta.description = point.description;
  });
});

console.log(`Created ${vg.entities.length} saved points`);
