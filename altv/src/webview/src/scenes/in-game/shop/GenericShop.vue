<script setup lang="ts">
import { computed, ref } from "vue";
import { getItemDescription, getItemName } from "@shared/modules/items";
import { type InventoryItem } from "@shared/interfaces";
import { ServerCall } from "@shared/calls/server";
import DarkBackground from "@/components/DarkBackground.vue";
import BackButtons from "@/components/buttons/BackButtons.vue";
import { useGameState } from "@/store/synced/game-state.store";
import { getItemGradeTextColor, getItemImage } from "@/utils/items";
import { useCharacter } from "@/store/synced/character.store";
import { asset } from "@/utils/asset";
import { rpc } from "@/rpc";
import Icon from "@/components/Icon/Icon.vue";
import { Sound, playSound } from "@/utils/sounds";
import ShopItemIcon from "./ShopItemIcon.vue";
import ShopActionModal from "./ShopActionModal.vue";
import { canBuy } from "./shop.utils";

const gameState = useGameState();
const character = useCharacter();

const shopStorage = computed(() => gameState.openedStorage!);

const modal = ref<InventoryItem | null>(null);

const items = computed(
  () =>
    shopStorage.value.inventory.items
      .map((inventoryItem) => ({
        ...inventoryItem,
        price: inventoryItem.price ?? 50,
      }))
      .map((inventoryItem) => ({
        ...inventoryItem,
        buyableAmount: canBuy(inventoryItem),
      })) ?? [],
);

function openBuyModal(inventoryItem: InventoryItem) {
  modal.value = inventoryItem;
}

async function buy(inventoryItem: InventoryItem, amount: number) {
  playSound(Sound.BUY);
  modal.value = null;

  await new Promise((resolve) => setTimeout(resolve, 500));

  await rpc.callServer(
    ServerCall.FromWebview.BUY_ITEM,
    {
      ...shopStorage.value.source,
      inventorySlot: inventoryItem.slot,
    },
    amount,
  );
}
</script>

<template>
  <div
    v-if="shopStorage"
    class="relative h-full"
  >
    <div class="absolute w-full px-10 py-8">
      <DarkBackground />
      <div class="mx-auto flex w-full items-center justify-end">
        <BackButtons />
      </div>
    </div>
    <div class="flex h-full w-full flex-col items-center justify-center">
      <div class="bg-neutral-900 p-4">
        <div class="mb-8 flex items-center gap-4 py-4">
          <div
            class="h-12 w-12 bg-contain bg-center"
            :style="{ 'background-image': `url(${asset('assets/icons/fishing-shop-logo.svg')})` }"
          />
          <!-- Shop name -->
          <div class="text-2xl font-bold uppercase text-white">{{ shopStorage.label }}</div>
          <div class="ml-auto text-right text-white">
            <div class="-mb-0.5 -mr-0.5 text-3xl font-extrabold text-lime-400">
              ${{ character.money }}
            </div>
          </div>
          <div class="mr-2 text-white">
            <Icon name="money" />
          </div>
          <div
            v-if="false"
            class="mr-4 cursor-pointer border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10"
          >
            <div class="text-sm font-extrabold uppercase text-white">sell to shop</div>
          </div>
        </div>
        <!-- Items Grid -->
        <div class="relative -m-4 p-4">
          <div
            v-if="items.length === 0"
            class="flex h-85 w-270 items-center justify-center"
          >
            <div class="text-3xl text-white">Out of stock</div>
          </div>
          <div
            v-else
            class="inline-grid grid-cols-4 gap-2 overflow-y-auto pr-4"
            :class="[items.length > 4 ? 'h-170' : 'h-85']"
            :style="{
              '--scrollbar-background-color': `#404040`,
              '--scrollbar-track-color': `rgb(from #D9D9D9 r g b / 5%)`,
              '--scrollbar-width': '0.25rem',
            }"
          >
            <div
              v-for="{ item, slot, price } in items"
              :key="`${item.key}-${slot}`"
              class="group relative flex h-full w-65 flex-col bg-zinc-800"
              :class="{ invisible: modal?.slot === slot, 'max-h-85': items.length <= 4 }"
            >
              <ShopItemIcon
                :id="slot"
                :image-url="getItemImage(item.key)"
              />
              <div class="flex h-full min-h-0 flex-col items-start gap-2 p-4">
                <div class="flex flex-col items-start gap-1">
                  <div
                    class="text-center text-xs font-bold uppercase"
                    :class="['grade' in item ? getItemGradeTextColor(item.grade) : 'invisible']"
                  >
                    {{ "grade" in item ? item.grade : "" }}
                  </div>
                  <div class="text-center font-extrabold uppercase text-white">
                    {{ getItemName(item.key) }}
                  </div>
                </div>
                <div class="text-sm font-bold text-zinc-400">
                  {{ getItemDescription(item.key) }}
                </div>
                <div class="mt-auto text-2xl font-extrabold uppercase text-lime-400">
                  $ {{ price }}
                </div>
              </div>
              <div
                class="absolute inset-0 z-10 flex transform-gpu cursor-pointer flex-col items-center justify-center gap-2.5 bg-neutral-900/[64%] opacity-0 hover:backdrop-blur-[1.5px] group-hover:opacity-100"
                @click="openBuyModal({ item, slot, price })"
              >
                <div
                  class="h-6 w-6 bg-contain bg-center"
                  :style="{ 'background-image': `url(${asset('assets/icons/pointer.svg')})` }"
                ></div>
                <div class="text-lg font-bold text-white">CLICK TO BUY</div>
              </div>
            </div>
          </div>
          <ShopActionModal
            v-if="modal"
            @close="modal = null"
            @submit="buy"
            v-bind="modal"
          />
        </div>
      </div>
    </div>
  </div>
</template>
