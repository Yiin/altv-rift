<script setup lang="ts">
import { computed } from "vue";
import { type Item, getItemName } from "@shared/modules/items";
import ItemIcon from "../inventory/ItemIcon.vue";

const props = defineProps<{
  item: Item;
}>();

const name = computed(() => getItemName(props.item.key));
const amount = computed(() => ("amount" in props.item ? props.item.amount : 1));
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="text-center text-base font-semibold text-white opacity-70">You received item</div>
    <div class="text-center text-base font-bold text-white">{{ name }}</div>
    <svg
      class="mt-2"
      xmlns="http://www.w3.org/2000/svg"
      width="102"
      height="79"
      viewBox="0 0 102 79"
      fill="none"
    >
      <path
        opacity="0.35"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.41421 51.956L50.9853 2.38492L100.556 51.956L73.5122 79.0001H74.9265L101.263 52.6631L101.971 51.956L101.263 51.2489L51.6924 1.67781L50.9853 0.970703L50.2782 1.67781L0.707107 51.2489L0 51.956L0.707107 52.6631L27.0441 79.0001H28.4583L1.41421 51.956Z"
        fill="white"
      />
    </svg>
    <div class="-mt-17 flex flex-col items-center">
      <ItemIcon
        :item="item"
        hide-amount
      />
      <div
        class="-mt-3 inline-flex items-center justify-center gap-2.5 rounded-sm bg-white px-2 py-0.5"
      >
        <div class="leading-0 -mb-0.5 text-sm font-bold text-black">x {{ amount }}</div>
      </div>
    </div>
  </div>
</template>
