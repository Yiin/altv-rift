import alt from "alt-server";
import { NpcID } from "@shared/modules/npc/types";
import { calcScore } from "./utils/calc-score";
import { npcStore } from ".";

/**
 * Player enters npc stream range, set it as owner if no owner exists
 */
alt.on("entityEnterColshape", (colshape, player) => {
  if (!(player instanceof alt.Player)) {
    return;
  }

  const npcId = colshape.getMeta("npcId");

  if (!npcId) {
    return;
  }

  const npc = npcStore.list.get(npcId);

  if (!npc) {
    return;
  }

  npcStore.streamIn(npc, player);
});

/**
 * Periodically check if there is a better owner for each npc.
 * Avg ping and distance are used to calculate a score.
 * New owner is set if the score is at least 25% better
 * than the current owners score.
 */
alt.setInterval(() => {
  for (const [id, npc] of npcStore.list) {
    const netOwnerId = npcStore.netOwners.get(id);
    const colShape = npcStore.colShapes.get(id);

    if (!colShape?.valid) {
      alt.log("Invalid colShape");
      continue;
    }

    if (!netOwnerId) {
      continue;
    }

    const netOwner = alt.Player.getByID(netOwnerId);

    if (!netOwner) {
      return;
    }

    const netOwnerScore = calcScore(netOwner, npc);

    const betterOwner = alt.Player.all.find(
      (p) => p.name === "Yiin" && colShape.isEntityIn(p) // && calcScore(p, npc) < netOwnerScore * 0.75
    );

    if (betterOwner && netOwner.id !== betterOwner?.id) {
      npcStore.setNetOwner(npc, betterOwner);
    }
  }
}, 1000);

/**
 * Player leaves npc stream range, remove it as owner if it was the owner
 */
alt.on("entityLeaveColshape", (colshape, player) => {
  if (!(player instanceof alt.Player)) {
    return;
  }

  const npcId = colshape.getMeta("npcId");

  if (!npcId) {
    return;
  }

  const npc = npcStore.list.get(npcId);

  if (!npc) {
    return;
  }

  npcStore.streamOut(npc, player);
});
