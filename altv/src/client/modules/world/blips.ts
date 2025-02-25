import game from "@altv/natives";
import { whileVirtualEntityIsStreamedIn } from "@/core/game-state-hooks/virtual-entity-is-streamed-in.state";

whileVirtualEntityIsStreamedIn(
  (entity) => !!entity.streamSyncedMeta.blipType,
  (entity) => {
    if (!entity.streamSyncedMeta.blipType) {
      return;
    }

    const blip = game.addBlipForCoord(entity.pos.x, entity.pos.y, entity.pos.z);

    game.setBlipSprite(blip, entity.streamSyncedMeta.blipType);

    if (entity.streamSyncedMeta.blipColor) {
      game.setBlipColour(blip, entity.streamSyncedMeta.blipColor);
    }

    return () => {
      game.removeBlip(blip);
    };
  },
);
