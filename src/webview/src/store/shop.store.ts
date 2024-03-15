import { defineStore } from "pinia";
import {
  type StorageItemSource,
  ItemSourceOrigin,
  type PlayerInventoryItemSource,
} from "@shared/interfaces";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/rpc";

type State =
  | {
      action: null;
      itemSource: null;
    }
  | {
      action: "buy" | "sell";
      itemSource: PlayerInventoryItemSource | StorageItemSource;
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
      return null as any;
    },
  },
  actions: {
    initiateBuying(itemSource: StorageItemSource) {
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

      // const inventory = useInventory();

      if (this.itemSource.origin === ItemSourceOrigin.Storage) {
        return rpc.callServer(ServerCall.FromWebview.BUY_ITEM, this.itemSource, amount);
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
    },
  },
});
