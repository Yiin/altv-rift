<script setup lang="ts">
import { useInventory } from "@/store/inventory.store";
import Window from "@/components/Window.vue";

defineProps<{
  item: {
    key: string;
  };
}>();

const inventory = useInventory();

function closePreview() {
  inventory.previewingItem = undefined;
}

const hw = window.innerWidth / 2 - 400;
const hh = window.innerHeight / 2 - 400;
</script>

<template>
  <Window v-click-outside="closePreview" :x="hw" :y="hh" :w="800" :h="800" name="item-preview" :is-active="false"
    :sticks="[]">
    <img :src="`./assets/item-previews/${item.key}.png`" class="w-full h-full" />
  </Window>
</template>
