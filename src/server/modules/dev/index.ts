import alt from "@altv/server";
import { reactive, watch } from "vue";
import { defineStore } from "pinia";
import { subscribeToStore } from "@shared/store/utils";
import { Inventory } from "@shared/interfaces";
import { createItem, FirearmWeapon, ItemGrade, MeleeWeapon, Ammo, ITEMS_REGISTRY } from "@shared/modules/items";
import { registerCmd } from "../chat";
import "./v1";
import { addItemToInventory, createInventory, removeItemFromInventorySlot } from "../items-manager";

const vg = alt.VirtualEntityGroup.create({ maxEntitiesInStream: 50 });

registerCmd("s", (player) => {
  // generate random amount 1-6
  const amount = Math.floor(Math.random() * 6) + 1;

  const items = [];

  for (let i = 0; i < amount; i++) {
    // generate random item
    const keys = [...ITEMS_REGISTRY.keys()];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    // generate random grade
    const grades = [ItemGrade.BASE, ItemGrade.ONE, ItemGrade.TWO, ItemGrade.THREE, ItemGrade.FOUR];
    const randomGrade = grades[Math.floor(Math.random() * grades.length)];

    // generate random amount
    const randomAmount = Math.floor(Math.random() * 100) + 1;

    items.push(createItem(randomKey, { grade: randomGrade, amount: randomAmount }));
  }

  alt.VirtualEntity.create({
    group: vg,
    pos: player.pos,
    streamingDistance: 100,
    data: {
      entityType: "storage",
      items
    }
  });
});

const useStore = defineStore('testing', {
  state: (): { inventory: Inventory | null } => ({
    inventory: null
  }),
});

const store = useStore();

async function test() {
  const inventory = reactive(createInventory({
    size: 10, items: [
      createItem(Ammo.ASSAULT_RIFLE_AMMO, { amount: 100 }),
      createItem(FirearmWeapon.ASSAULTRIFLE),
      createItem(MeleeWeapon.BAT),
    ],
  }));

  subscribeToStore(store, {
    onSetState(state) {
      console.log('set state:', state);
    },
    onUpdateState(payload) {
      console.log('update state:', payload);
    },
  });

  store.inventory = inventory;

  await alt.Utils.waitForNextTick();

  const item = removeItemFromInventorySlot(inventory, 0);

  await alt.Utils.waitForNextTick();

  if (item) {
    addItemToInventory(inventory, item);
  }
}

test();
