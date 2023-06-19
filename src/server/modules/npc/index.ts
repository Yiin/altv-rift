import alt from "alt-server";
import { createPinia } from "pinia";
import { watch } from "vue";
import "./stream-range";
import { omit } from "lodash";
import {
  LastUpdateTimestamp,
  NpcFlags,
  NpcID,
  NpcSyncPayload,
  PedType,
} from "@shared/modules/npc/types";
import { Bones } from "@shared/enums/bones";
import {
  getWeaponHash,
  getWeaponItemByKey,
  WeaponItemKey,
} from "@shared/modules/items";
import { DamageMultiplier } from "@shared/modules/combat/damage-multipliers";
import { taskAimAt, taskGoTo } from "@shared/modules/npc/tasks";
import { Npc } from "@shared/modules/npc/npc";
import { ServerEvents } from "@shared/events/server";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/rpc";
import { registerCmd } from "../chat";
import { useNpcStore } from "./npc.store";

export const npcStore = useNpcStore(createPinia());

watch(npcStore.$state.list, (list) => {
  for (const [id, npc] of list) {
    const colShape = npcStore.colShapes.get(id)!;

    // Update stream range colshape position
    colShape.pos = npc.position;
  }
});

rpc.registerClient(
  ServerCall.FromClient.APPLY_NPC_DAMAGE,
  (player, npcId, damageData) => {
    const npc = npcStore.list.get(npcId);
    if (!npc) {
      return 0;
    }

    if (npc.health <= 0) {
      return 0;
    }

    const { bone, weapon, nativeDamage } = damageData;
    const weaponData = getWeaponItemByKey(weapon);
    const damage =
      bone && weaponData?.stats.damage
        ? weaponData.stats.damage * DamageMultiplier[bone as Bones]
        : nativeDamage;

    npc.health -= damage ?? 0;

    if (npc.health <= 0) {
      npc.health = 0;
      npc.currentTask = undefined;
      setTimeout(() => {
        npcStore.removeNpc(npcId);
      }, 5000);
    }

    return npc.health;
  }
);

registerCmd("npc", (player) => {
  alt.log('Creating NPC for player: "' + player.name + '"');
  const npc = npcStore.createNpc(
    PedType.DYNAMIC,
    alt.hash("cs_nigel"),
    player.pos,
    player.rot.z,
    1000,
    {
      flags: NpcFlags.None,
    }
  );
  alt.log('Created NPC with ID: "' + npc.id + '"');
});

registerCmd("npcw", (player, args) => {
  const npcId = Number(args[0]) as NpcID;
  const npc = npcStore.list.get(npcId);
  if (!npc) return;

  const weaponHash = getWeaponHash(args[1] as WeaponItemKey);

  alt.log(`Setting NPC ${npcId} weapon to ${weaponHash} (${args[1]})`);
  npc.weaponHash = weaponHash;
});

registerCmd("goto", (player, args) => {
  const npcId = Number(args[0]) as NpcID;
  const npc = npcStore.list.get(npcId);
  if (!npc) return;
  if (!npc.health) return;

  npc.currentTask = taskGoTo(player.pos);
});

registerCmd("aimat", (player, args) => {
  const npcId = Number(args[0]) as NpcID;
  const npc = npcStore.list.get(npcId);
  if (!npc) return;
  if (!npc.health) return;

  npc.currentTask = taskAimAt(player.id);
});

alt.onClient(
  ServerEvents.FromClient.SYNC_NPC,
  (player, payload: NpcSyncPayload) => {
    if (npcStore.netOwners.get(payload.id) !== player.id) {
      return;
    }

    const npc = npcStore.list.get(payload.id);

    if (!npc) {
      return;
    }

    const { velocity, rotationVelocity, ...rest } = payload;

    const dataToUpdate: Partial<Npc> = omit(rest, [
      "id",
      "type",
      "modelHash",
      "maxHealth",
      "health",
      "weaponHash",
      "currentTask",
    ]);

    if (velocity) {
      dataToUpdate.velocity = [Date.now() as LastUpdateTimestamp, velocity];
    }

    if (rotationVelocity) {
      dataToUpdate.rotationVelocity = [
        Date.now() as LastUpdateTimestamp,
        rotationVelocity,
      ];
    }

    Object.assign(npc, dataToUpdate);
  }
);

alt.onClient(ServerEvents.FromClient.STOP_NPC_TASK, (player, npcId: NpcID) => {
  if (!player.store?.sync.npc.netOwnerOf.has(npcId)) return;

  const npc = npcStore.list.get(npcId);
  if (!npc) return;

  npc.currentTask = undefined;
});
