<script setup lang="ts">
import { ref, computed } from "vue";
import {
  getItemEquipmentSlot,
  getItemName,
  isItemClothing,
  isUnisexClothing,
  isFemaleClothing,
} from "@shared/modules/items";
import { EquipmentSlot } from "@shared/interfaces";
import { ServerCall } from "@shared/calls/server";
import BackButtons from "@/components/buttons/BackButtons.vue";
import Icon from "@/components/Icon/Icon.vue";
import ItemIcon from "@/scenes/in-game/inventory/ItemIcon.vue";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { rem } from "@/composables/use-pixel";
import { useCharacter } from "@/store/synced/character.store";
import { rpc } from "@/rpc";
import { Sound, playSound } from "@/lib/utils";
import { useGameState } from "@/store/synced/game-state.store";
import ClothingLogo from "./assets/clothing-logo.svg";

const character = useCharacter();
const gameState = useGameState();
const shopStorage = computed(() => gameState.openedStorage!);

// UI state
const selectedCategory = ref<ClothingSlot | null>(null);
const selectedItem = ref<string | null>(null);

type ClothingSlot = Extract<
  EquipmentSlot,
  | EquipmentSlot.Mask
  | EquipmentSlot.Glasses
  | EquipmentSlot.Headwear
  | EquipmentSlot.Earrings
  | EquipmentSlot.Top
  | EquipmentSlot.Accessory
  | EquipmentSlot.LeftHand
  | EquipmentSlot.RightHand
  | EquipmentSlot.Gloves
  | EquipmentSlot.Pants
  | EquipmentSlot.Shoes
  | EquipmentSlot.Backpack
>;

const categoryIcons: Record<ClothingSlot, { name: string; class: string }> = {
  [EquipmentSlot.Mask]: { name: "material-symbols:domino-mask", class: "w-6" },
  [EquipmentSlot.Glasses]: { name: "clothing-shop:glasses", class: "w-full" },
  [EquipmentSlot.Headwear]: { name: "clothing-shop:hat", class: "w-full" },
  [EquipmentSlot.Earrings]: { name: "game-icons:drop-earrings", class: "w-6" },
  [EquipmentSlot.Top]: { name: "clothing-shop:tshirt", class: "w-full" },
  [EquipmentSlot.Accessory]: { name: "mdi:necklace", class: "w-6" },
  [EquipmentSlot.LeftHand]: { name: "ion:hand-left", class: "w-6" },
  [EquipmentSlot.RightHand]: { name: "ion:hand-right", class: "w-6" },
  [EquipmentSlot.Gloves]: { name: "clothing-shop:gloves", class: "w-full" },
  [EquipmentSlot.Pants]: { name: "clothing-shop:pants", class: "w-full" },
  [EquipmentSlot.Shoes]: { name: "clothing-shop:shoes", class: "w-full" },
  [EquipmentSlot.Backpack]: { name: "clothing-shop:bag", class: "w-full" },
};

const categoryDisplayNames: Record<ClothingSlot, string> = {
  [EquipmentSlot.Mask]: "Mask",
  [EquipmentSlot.Glasses]: "Glasses",
  [EquipmentSlot.Headwear]: "Headwear",
  [EquipmentSlot.Earrings]: "Earrings",
  [EquipmentSlot.Top]: "Top",
  [EquipmentSlot.Accessory]: "Necklaces",
  [EquipmentSlot.LeftHand]: "Left Hand",
  [EquipmentSlot.RightHand]: "Right Hand",
  [EquipmentSlot.Gloves]: "Gloves",
  [EquipmentSlot.Pants]: "Pants",
  [EquipmentSlot.Shoes]: "Shoes",
  [EquipmentSlot.Backpack]: "Backpack",
};

const availableCategories = computed(() => {
  const categories = Object.values(shopStorage.value.inventory.items).map((item) =>
    getItemEquipmentSlot(item.item),
  );
  return [...new Set(categories)].filter(
    (category): category is ClothingSlot => category !== undefined && category in categoryIcons,
  );
});

const filteredItems = computed(() => {
  if (!selectedCategory.value) {
    return Object.values(shopStorage.value.inventory.items);
  }
  return Object.values(shopStorage.value.inventory.items).filter(
    (item) => getItemEquipmentSlot(item.item) === selectedCategory.value,
  );
});

// Helper functions
function canAfford(price: number | null): boolean {
  if (price === null) return true;
  return character.money >= price;
}

// Event handlers
async function handleItemClick(itemKey: string): Promise<void> {
  if (selectedItem.value === itemKey) {
    // Handle purchase
    const item = filteredItems.value.find((item) => item.item.key === itemKey);
    if (!item || !canAfford(item.price)) return;

    playSound(Sound.BUY);

    // Reset selection
    selectedItem.value = null;

    // Wait for sound to play before sending purchase request
    await new Promise((resolve) => setTimeout(resolve, 300));

    await rpc.callServer(
      ServerCall.FromWebview.BUY_ITEM,
      {
        ...shopStorage.value.source,
        inventorySlot: item.slot,
      },
      1,
    );
  } else {
    // Handle preview/select
    selectedItem.value = itemKey;
  }
}
</script>

<template>
  <div class="relative flex h-full w-full flex-col px-20 pb-17 pt-20">
    <div class="fixed inset-0 -z-10">
      <div
        class="absolute inset-0 bg-linear-to-r from-black/80 from-20% to-transparent opacity-95"
      ></div>
    </div>

    <div class="mx-auto flex w-full items-center justify-between">
      <div class="flex w-[40%] max-w-[264px] items-center gap-6">
        <ClothingLogo class="w-75" />
      </div>
      <BackButtons />
    </div>

    <!-- Main Section -->
    <main class="relative ml-8 w-full max-w-xl">
      <!-- Category section -->
      <div class="grid w-full grid-cols-9 gap-2 overflow-x-hidden">
        <TooltipProvider :delay-duration="0">
          <Tooltip
            v-for="category in availableCategories"
            :key="category"
          >
            <TooltipTrigger>
              <div
                class="flex cursor-pointer items-center justify-center border border-white/[0.03] bg-[#D9D9D905] text-white hover:border-sunriseYellow/50"
                :class="{
                  'border-sunriseYellow bg-sunriseYellow/10': selectedCategory === category,
                  'hover:bg-white/10': selectedCategory !== category,
                }"
                @click="selectedCategory = selectedCategory === category ? null : category"
              >
                <Icon
                  v-if="categoryIcons[category]"
                  :name="categoryIcons[category].name"
                  :class="[
                    categoryIcons[category].class,
                    selectedCategory === category ? 'text-sunriseYellow' : '',
                  ]"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ categoryDisplayNames[category] }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <!-- Clothes item section -->
      <div
        class="clothes relative mt-10 h-[calc(100vh_-_172px)] overflow-y-auto pb-12 pl-3"
        dir="rtl"
      >
        <div
          class="grid grid-cols-3 gap-4"
          dir="ltr"
        >
          <div
            v-for="item in filteredItems"
            :key="item.item.key"
            class="flex flex-col border-x border-t border-[#5e5d5d] border-opacity-70 bg-[#494848] bg-opacity-20"
          >
            <div class="relative flex h-52 flex-1 flex-col items-center justify-center gap-4">
              <figure class="flex flex-col justify-center pt-4">
                <ItemIcon
                  :item="item.item"
                  :width="rem(90)"
                  :height="rem(90)"
                />
              </figure>
              <div class="mb-2 flex flex-col items-center">
                <h1 class="my-2 font-bold uppercase text-white">
                  <div class="flex items-center gap-2">
                    <div
                      v-if="isItemClothing(item.item)"
                      class="absolute left-4 top-2"
                    >
                      <span v-if="isUnisexClothing(item.item.key)">
                        <span class="font-bold text-gray-500">U</span>
                      </span>
                      <span
                        v-else-if="isFemaleClothing(item.item.key)"
                        class="font-bold text-pink-400"
                      >
                        F
                      </span>
                      <span
                        v-else
                        class="font-bold text-gray-500"
                      >
                        M
                      </span>
                    </div>
                    {{ getItemName(item.item.key) }}
                  </div>
                </h1>
                <div class="text-lg font-semibold text-sunriseYellow">${{ item.price }}</div>
              </div>
            </div>
            <TooltipProvider :delay-duration="0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    @click="handleItemClick(item.item.key)"
                    :disabled="!canAfford(item.price)"
                    :class="[
                      'h-14 w-full text-sm font-extrabold uppercase transition-colors duration-200',
                      selectedItem === item.item.key
                        ? 'bg-sunriseYellow text-black hover:bg-sunriseYellow/90'
                        : canAfford(item.price)
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'cursor-not-allowed bg-white/5 text-white/50',
                    ]"
                  >
                    {{ selectedItem === item.item.key ? "Purchase" : "Select" }}
                  </button>
                </TooltipTrigger>
                <TooltipContent v-if="!canAfford(item.price)">
                  <p>
                    {{
                      item.price === null
                        ? "Not for sale"
                        : `You need $${item.price - character.money} more`
                    }}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
