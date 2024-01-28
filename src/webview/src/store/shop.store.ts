import { InteractionInventoryItemSource, InventoryItemSource, ItemSourceOrigin, PlayerInventoryItemSource } from "@shared/interfaces";
import { defineStore } from "pinia";
import { useGameState } from "./synced/game-state.store";
import { useInventory } from "./inventory.store";
import { rpc } from "@/rpc";
import { ServerCall } from "@shared/calls/server";
import { InteractionInventoryType } from "@shared/store/game-state.store";

type State = {
  action: null;
  itemSource: null;
} | {
  action: "buy" | "sell";
  itemSource: PlayerInventoryItemSource | InteractionInventoryItemSource;
};

export const useShop = defineStore("shop", {
  state: (): State => ({
    action: null,
    itemSource: null,
  }),
  getters: {
    isInShop(): boolean {
      return this.interaction !== null;
    },
    interaction() {
      const gameState = useGameState();
      return gameState.interactionInventory?.type === InteractionInventoryType.Shop ? gameState.interactionInventory : null;
    },
  },
  actions: {
    initiateBuying(itemSource: InteractionInventoryItemSource) {
      this.action = "buy";
      this.itemSource = itemSource;
    },
    initiateSelling(itemSource: PlayerInventoryItemSource) {
      this.action = "sell";
      this.itemSource = itemSource;
    },
    submit(amount: number) {
      if (!this.interaction) {
        return;
      }

      if (!this.itemSource) {
        return;
      }

      const inventory = useInventory();

      if (this.itemSource.origin === ItemSourceOrigin.InteractionInventory) {
        return rpc.callServer(
          ServerCall.FromWebview.BUY_ITEM,
          this.itemSource,
          amount,
        );
      } else if (this.itemSource.origin === ItemSourceOrigin.PlayerInventory) {
        return rpc.callServer(
          ServerCall.FromWebview.SELL_ITEM,
          this.interaction.source,
          this.itemSource,
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
