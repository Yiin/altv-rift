import { defineStore } from "pinia";
import { usePlayerStore } from "@shared/store/player.store";
import { rpc } from "@/rpc";
import { InventoryItem } from "@shared/interfaces/prisma-overrides";
import { ClientCall } from "@shared/calls/client";
import { ServerCall } from "@shared/calls/server";

const items = [
  {
    slot: 0,
    data: {
      key: "snowball",
      type: "WEAPON",
      WEAPON: {
        durability: 100,
        ammo: null,
        components: [],
        tints: [],
      },
    },
  },
  {
    slot: 1,
    data: {
      key: "appistol",
      type: "WEAPON",
      WEAPON: {
        durability: 100,
        ammo: null,
        components: [],
        tints: [],
      },
    },
  },
  {
    slot: 2,
    data: {
      key: "handgunammo",
      type: "AMMO",
      AMMO: {
        amount: 100,
      },
    },
  },
] as InventoryItem[];

export const useInventory = defineStore("inventory", {
  getters: {
    size: () => {
      if (window.altMock) {
        return 10;
      }
      return usePlayerStore().character?.inventory.size ?? 0;
    },
    items: () => {
      if (window.altMock) {
        return items;
      }
      return (usePlayerStore().character?.inventory.items.filter(Boolean) ??
        []) as InventoryItem[];
    },
  },
  actions: {
    useItem(slot: number) {
      return rpc.callClient(ClientCall.FromWebview.USE_ITEM, slot);
    },
    equipItem(slot: number) {
      return rpc.callClient(ClientCall.FromWebview.EQUIP_ITEM, slot);
    },
    dropItem(slot: number) {
      return rpc.callClient(ClientCall.FromWebview.DROP_ITEM, slot);
    },
    async moveItem(
      from: number,
      to: number,
      local: boolean | undefined = false
    ) {
      const itemInSlotFrom = this.items.find(({ slot }) => {
        return slot === from;
      });
      const itemInSlotTo = this.items.find(({ slot }) => {
        return slot === to;
      });
      if (itemInSlotFrom && itemInSlotTo) {
        [itemInSlotFrom.slot, itemInSlotTo.slot] = [
          itemInSlotTo.slot,
          itemInSlotFrom.slot,
        ];
      } else if (itemInSlotFrom) {
        itemInSlotFrom.slot = to;
      } else if (itemInSlotTo) {
        itemInSlotTo.slot = from;
      }

      if (local) {
        return true;
      }

      const ok = await rpc.callServer(
        ServerCall.FromWebview.MOVE_ITEM,
        from,
        to
      );

      if (!ok) {
        this.moveItem(to, from, true);
      }
      return ok;
    },
  },
});
