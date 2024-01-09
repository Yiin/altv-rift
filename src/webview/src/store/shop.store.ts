import { InventoryItemSource, LocalItemSource, ShopSource } from "@shared/interfaces";
import { defineStore } from "pinia";
import { useGameState } from "./synced/game-state.store";
import { SlottedInventoryItem, useInventory } from "./inventory.store";
import { rpc } from "@/rpc";
import { ServerCall } from "@shared/calls/server";

type State = {
  action: null;
  itemSource: null;
} | {
  action: "buy" | "sell";
  itemSource: LocalItemSource;
};

export const useShop = defineStore("shop", {
  state: (): State => ({
    action: null,
    itemSource: null,
  }),
  getters: {
    interaction() {
      const gameState = useGameState();
      return gameState.interaction?.source.origin === "shop" ? gameState.interaction : null;
    },
    item(): SlottedInventoryItem | null {
      if (!this.itemSource) {
        console.log("no item source");
        return null;
      }

      if (this.itemSource.type === "equipment") {
        console.log("equipment");
        return null;
      }

      const inventory = useInventory();
      const item = inventory.getItemFromSource(this.itemSource);

      if (!item) {
        console.log("no item", this.itemSource);
        return null;
      }

      return item;
    }
  },
  actions: {
    initiateBuying(itemSource: LocalItemSource) {
      this.action = "buy";
      this.itemSource = itemSource;
    },
    initiateSelling(itemSource: LocalItemSource) {
      this.action = "sell";
      this.itemSource = itemSource;
    },
    submit(amount: number) {
      if (this.interaction?.source.origin !== "shop") {
        return;
      }

      if (!this.itemSource) {
        return;
      }

      const inventory = useInventory();

      if (this.itemSource.type === "interaction") {
        return rpc.callServer(
          ServerCall.FromWebview.BUY_ITEM,
          inventory.toItemSource(this.itemSource) as InventoryItemSource,
          amount,
        );
      } else if (this.itemSource.type === "inventory") {
        return rpc.callServer(
          ServerCall.FromWebview.SELL_ITEM,
          this.interaction.source as ShopSource,
          inventory.toItemSource(this.itemSource) as InventoryItemSource,
          amount,
        );
      }
      return;
    },
    cancel() {
      this.action = null;
      this.itemSource = null;
    }
  },
})
