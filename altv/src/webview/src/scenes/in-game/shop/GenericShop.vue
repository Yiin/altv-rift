<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Ammo,
  FirearmWeapon,
  FoodIngredient,
  ItemGrade,
  MeleeWeapon,
  createItem,
  getItemDescription,
  getItemName,
} from "@shared/modules/items";
import type { InventoryItem } from "@shared/interfaces";
import DarkBackground from "@/components/DarkBackground.vue";
import BackButtons from "@/components/buttons/BackButtons.vue";
import { useGameState } from "@/store/synced/game-state.store";
import { getItemGradeTextColor, getItemImage } from "@/utils/items";
import { useCharacter } from "@/store/synced/character.store";
import ShopItemIcon from "./ShopItemIcon.vue";
import ShopActionModal from "./ShopActionModal.vue";
import { canBuy } from "./shop.utils";

const gameState = useGameState();
const character = useCharacter();

const modal = ref<InventoryItem | null>(null);

const items = computed(
  () =>
    gameState.openedStorage?.inventory.items.map((inventoryItem) => ({
      ...inventoryItem,
      buyableAmount: canBuy(inventoryItem),
    })) ?? [],
);

// const items: InventoryItem[] = [
//   { item: createItem(Ammo.HANDGUN_AMMO, { amount: 1000 }), slot: 0, price: 500 },
//   { item: createItem(Ammo.SHOTGUN_AMMO, { amount: 1000 }), slot: 1, price: 500 },
//   { item: createItem(FoodIngredient.RAW_SALMON, { amount: 20 }), slot: 2, price: 500 },
//   {
//     item: createItem(FirearmWeapon.ASSAULTSMG, { grade: ItemGrade.UNCOMMON }),
//     slot: 3,
//     price: 500,
//   },
//   { item: createItem(MeleeWeapon.BATTLEAXE, { grade: ItemGrade.RARE }), slot: 4, price: 5000 },
//   { item: createItem(FoodIngredient.RAW_GOLDEN_KOI, { amount: 1 }), slot: 5, price: 500 },
//   { item: createItem(FoodIngredient.RAW_GOLDEN_KOI, { amount: 1 }), slot: 6, price: 500 },
//   { item: createItem(FoodIngredient.RAW_GOLDEN_KOI, { amount: 1 }), slot: 7, price: 500 },
//   { item: createItem(FoodIngredient.RAW_GOLDEN_KOI, { amount: 1 }), slot: 8, price: 500 },
//   { item: createItem(FoodIngredient.RAW_GOLDEN_KOI, { amount: 1 }), slot: 9, price: 500 },
// ];

function buyItem(inventoryItem: InventoryItem) {
  modal.value = inventoryItem;
  console.log("Buying item", inventoryItem);
}
</script>

<template>
  <div class="relative h-full">
    <div class="absolute w-full px-10 py-8">
      <DarkBackground />
      <div class="mx-auto flex w-full items-center justify-end">
        <BackButtons />
      </div>
    </div>
    <div class="flex h-full w-full flex-col items-center justify-center">
      <div class="bg-neutral-900 p-4">
        <div class="mb-8 flex items-center gap-4 py-4">
          <div class="h-12 w-12 bg-contain bg-center"
            :style="{ 'background-image': `url('./assets/icons/fishing-shop-logo.svg')` }" />
          <!-- Shop name -->
          <div class="text-2xl font-bold uppercase text-white">Uncle Bob Fishing shop</div>
          <div class="ml-auto mr-2 text-right text-white">
            <div class="-mb-0.5 -mr-0.5 text-xl font-extrabold text-lime-400">
              ${{ character.money }}
            </div>
            <div class="text-sm font-semibold uppercase text-gray-200">Cash</div>
          </div>
          <div class="mr-4 cursor-pointer border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10">
            <div class="text-sm font-extrabold uppercase text-white">sell to shop</div>
          </div>
        </div>
        <!-- Items Grid -->
        <div class="relative -m-4 p-4">
          <div class="inline-grid max-h-170 grid-cols-4 gap-2 overflow-y-auto pr-4" :style="{
            '--scrollbar-background-color': `#404040`,
            '--scrollbar-track-color': `rgb(from #D9D9D9 r g b / 5%)`,
            '--scrollbar-width': '0.25rem',
          }">
            <div v-if="items.length === 0">
              <div class="text-white">No items</div>
            </div>
            <div v-for="{ item, slot, price } in items" :key="`${item.key}-${slot}`"
              class="group relative flex h-full w-65 flex-col bg-zinc-800" :class="{ invisible: modal?.slot === slot }">
              <ShopItemIcon :id="slot" :image-url="getItemImage(item.key)" />
              <div v-if="'amount' in item"
                class="absolute right-4 top-28 z-10 text-center text-xl font-extrabold uppercase text-gray-200">
                {{ item.amount }}
              </div>
              <div class="mt-1 flex h-full min-h-0 flex-col items-start gap-2 p-4">
                <div class="flex flex-col items-start gap-1">
                  <div class="text-center text-xs font-bold uppercase"
                    :class="['grade' in item ? getItemGradeTextColor(item.grade) : 'invisible']">
                    {{ "grade" in item ? item.grade : "" }}
                  </div>
                  <div class="text-center font-extrabold uppercase text-white">
                    {{ getItemName(item.key) }}
                  </div>
                </div>
                <div class="text-sm font-bold text-zinc-400">
                  {{ getItemDescription(item.key) }}
                </div>
                <div class="mt-auto text-xl font-extrabold uppercase text-lime-400">
                  $ {{ price }}
                </div>
              </div>
              <div
                class="absolute inset-0 z-10 flex transform-gpu cursor-pointer flex-col items-center justify-center gap-2.5 bg-neutral-900/[64%] opacity-0 hover:backdrop-blur-[1.5px] group-hover:opacity-100"
                @click="buyItem({ item, slot, price })">
                <div class="h-6 w-6 bg-contain bg-center"
                  :style="{ 'background-image': `url('./assets/icons/pointer.svg')` }"></div>
                <div class="text-lg font-bold text-white">CLICK TO BUY</div>
              </div>
            </div>
          </div>
          <ShopActionModal v-if="modal" @close="modal = null" v-bind="modal" />
        </div>
      </div>
    </div>
  </div>
</template>
