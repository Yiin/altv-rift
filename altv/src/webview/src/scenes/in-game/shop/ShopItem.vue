<script setup lang="ts">
import type { Item } from "@shared/modules/items";

defineProps<{
  shopItem: {
    item: Item;
    price: number | null;
    slot: number;
  };
  modal;
}>();
</script>

<template>
  <div
    class="group relative flex h-full w-65 flex-col bg-zinc-800"
    :class="{ invisible: modal?.slot === slot }"
  >
    <ShopItemIcon
      :id="slot"
      :image-url="getItemImage(item.key)"
    />
    <div
      v-if="'amount' in item"
      class="absolute right-4 top-28 z-10 text-center text-xl font-extrabold uppercase text-gray-200"
    >
      {{ item.amount }}
    </div>
    <div class="mt-1 flex h-full min-h-0 flex-col items-start gap-2 p-4">
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
      <div class="mt-auto text-xl font-extrabold uppercase text-lime-400">$ {{ price }}</div>
    </div>
    <div
      class="absolute inset-0 z-10 flex transform-gpu cursor-pointer flex-col items-center justify-center gap-2.5 bg-neutral-900/[64%] opacity-0 hover:backdrop-blur-[1.5px] group-hover:opacity-100"
      @click="buyItem({ item, slot, price })"
    >
      <div
        class="h-6 w-6 bg-contain bg-center"
        :style="{ 'background-image': `url('./assets/icons/pointer.svg')` }"
      ></div>
      <div class="text-lg font-bold text-white">CLICK TO BUY</div>
    </div>
  </div>
</template>
