import alt from "alt-server";
import { defineStore } from "pinia";
import { markRaw } from "vue";
import { Npc } from "@shared/modules/npc/npc";
import { PedType } from "@shared/modules/npc/types";
import { calcScore } from "./utils/calc-score";

export const useNpcStore = defineStore("npc", {
  state: () => ({
    lastId: 0 as Npc["id"],
    list: new Map<Npc["id"], Npc>(),
    netOwners: new Map<Npc["id"], alt.Player["id"]>(),
    colShapes: new Map<Npc["id"], alt.ColshapeCircle>(),
  }),
  actions: {
    createNpc(
      type: PedType,
      modelHash: number,
      pos: alt.Vector3,
      rot: number,
      health: number
    ) {
      this.lastId++;

      // NPC is a class that holds all the synced data for an npc
      const npc = new Npc(
        this.lastId,
        type,
        modelHash,
        pos,
        rot,
        health,
        health
      );
      this.list.set(this.lastId, npc);

      // Create a colshape that is used to check if a player is in range to sync the npc
      const streamRangeColShape = new alt.ColshapeCircle(pos.x, pos.y, 100);
      streamRangeColShape.setMeta("npcId", npc.id);
      streamRangeColShape.playersOnly = true;
      this.colShapes.set(this.lastId, markRaw(streamRangeColShape));

      return npc;
    },

    streamIn(npc: Npc, player: alt.Player) {
      if (!this.netOwners.has(npc.id)) {
        this.setNetOwner(npc, player);
      } else if (
        player.name === "Yiin" &&
        this.netOwners.get(npc.id) !== player.id
      ) {
        alt.log(
          this.netOwners.get(npc.id),
          player.id,
          typeof this.netOwners.get(npc.id),
          typeof player.id
        );
        this.setNetOwner(npc, player);
      }
      player.store.sync.npc.streamedIn.push(npc);

      alt.logDebug(`NPC ${npc.id} streamed in for ${player.name}`);
    },

    setNetOwner(npc: Npc, player: alt.Player) {
      if (this.netOwners.has(npc.id)) {
        const previousNetOwner = alt.Player.getByID(
          this.netOwners.get(npc.id)!
        );
        if (previousNetOwner) {
          previousNetOwner.store.sync.npc.netOwnerOf.delete(npc.id);
        }
      }
      this.netOwners.set(npc.id, player.id);
      player.store.sync.npc.netOwnerOf.add(npc.id);
      alt.logDebug(`NPC ${npc.id} new net owner is ${player.name}`);
    },

    streamOut(npc: Npc, player: alt.Player) {
      player.store.sync.npc.streamedIn.splice(
        player.store.sync.npc.streamedIn.findIndex((n) => n.id === npc.id),
        1
      );

      if (
        this.netOwners.has(npc.id) &&
        this.netOwners.get(npc.id) === player.id
      ) {
        player.store.sync.npc.netOwnerOf.delete(npc.id);

        const colshape = this.colShapes.get(npc.id)!;
        const nextNetOwner = alt.Player.all
          .filter((potentialNetOwner) => colshape.isEntityIn(potentialNetOwner))
          .map((potentialNetOwner) => ({
            potentialNetOwner,
            score: calcScore(potentialNetOwner, npc),
          }))
          .sort((a, b) => a.score - b.score)
          .at(0)?.potentialNetOwner;

        if (nextNetOwner) {
          this.setNetOwner(npc, nextNetOwner);
        } else {
          this.netOwners.delete(npc.id);
        }
      }
      alt.logDebug(`NPC ${npc.id} streamed out for ${player.name}`);
    },
  },
});
