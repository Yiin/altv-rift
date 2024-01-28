// import { InventoryItemSource, LocalItemSource, StorageSource } from "@shared/interfaces";
// import { defineStore } from "pinia";
// import { useGameState } from "./synced/game-state.store";
// import { SlottedInventoryItem, useInventory } from "./inventory.store";
// import { rpc } from "@/rpc";
// import { ServerCall } from "@shared/calls/server";

// type State = {
//   moving: null
// } | {
//   moving: {
//     from: LocalItemSource;
//     to: LocalItemSource;
//     amount: number;
//   }
// };

// export const useStorage = defineStore("storage", {
//   state: (): State => ({
//     moving: null,
//   }),
//   getters: {
//     interaction() {
//       const gameState = useGameState();
//       return gameState.interactionInventory?.source.origin === "storage" ? gameState.interactionInventory : null;
//     },
//     movingItem(): SlottedInventoryItem | null {
//       if (!this.moving) {
//         return null;
//       }

//       if (this.moving.from.type === "equipment" || this.moving.to.type === "equipment") {
//         return null;
//       }

//       const inventory = useInventory();
//       const item = inventory.getItemFromSource(this.moving.from);

//       if (!item) {
//         console.log("no item", this.moving.from);
//         return null;
//       }

//       return item;
//     }
//   },
//   actions: {
//     initiateMoving(from: LocalItemSource, to: LocalItemSource) {
//       this.moving = {
//         from,
//         to,
//         amount: 1,
//       };
//     },
//     submit(amount: number) {
//       if (this.interaction?.source.origin !== "storage") {
//         return;
//       }

//       if (!this.moving) {
//         return;
//       }

//       const inventory = useInventory();

//       inventory.moveItem(this.moving.from, this.moving.to);

//       if (this.moving.type === "interaction") {
//         return rpc.callServer(
//           ServerCall.FromWebview.BUY_ITEM,
//           inventory.toItemSource(this.itemSource) as InventoryItemSource,
//           amount,
//         );
//       } else if (this.itemSource.type === "inventory") {
//         return rpc.callServer(
//           ServerCall.FromWebview.SELL_ITEM,
//           this.interaction.source as StorageSource,
//           inventory.toItemSource(this.itemSource) as InventoryItemSource,
//           amount,
//         );
//       }
//       return;
//     },
//     cancel() {
//       this.action = null;
//       this.itemSource = null;
//     }
//   },
// })
