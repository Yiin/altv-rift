import alt from "@altv/client";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import {
  hasPickaxeInHand,
  isNextToOre,
  isTryingToMine,
  getMiningOre,
  doTheMining,
} from "./lib";
import { clientState } from "@/core/store/client.store";
import { ActionTipType } from "@shared/store/client.store";
import { whileVirtualEntityIsStreamedIn } from "@/core/game-state-hooks/virtual-entity-is-streamed-in.state";
import { VirtualEntityType } from "@shared/interfaces";
import { getGroundPos } from "@/core/utility/get-ground-pos";

whileInGame(() => {
  const tick = alt.Timers.everyTick(async () => {
    if (hasPickaxeInHand() && isNextToOre()) {
      if (!clientState.actionTip) {
        clientState.actionTip = {
          type: ActionTipType.MINING,
        };
      }
      if (isTryingToMine()) {
        const tree = getMiningOre();
        await doTheMining(tree);
      }
    } else {
      if (clientState.actionTip?.type === ActionTipType.MINING) {
        clientState.actionTip = null;
      }
    }
  });

  return () => {
    tick.destroy();
  };
});

whileVirtualEntityIsStreamedIn((entity) => entity.streamSyncedMeta.entityType === VirtualEntityType.Ore, async (entity) => {
  const pos = await getGroundPos(entity.pos);
  const tick = alt.Drawing.drawText3d(entity.streamSyncedMeta.oreType, pos);

  const obj = alt.LocalObject.create({
    model: 'cs_x_rubweec',
    pos,
    rot: alt.Vector3.zero,
    dynamic: false,
    noOffset: true,
    useStreaming: true,
    streamingDistance: 100,
  });
  obj.positionFrozen = true;

  return () => {
    tick.destroy();
    obj.destroy();
  };
});
