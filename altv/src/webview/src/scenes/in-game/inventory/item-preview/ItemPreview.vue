<script setup lang="ts">
import { clearPreviewingItem } from "@/store/inventory";
import Window from "@/components/Window.vue";
import { asset } from "@/utils/asset";

defineProps<{
  item: {
    key: string;
  };
}>();

const hw = window.innerWidth / 2 - 400;
const hh = window.innerHeight / 2 - 400;
</script>

<template>
  <Window
    v-click-outside="clearPreviewingItem"
    :x="hw"
    :y="hh"
    :w="800"
    :h="800"
    name="item-preview"
    :is-active="false"
    :sticks="[]"
  >
    <img
      :src="asset(`assets/item-previews/${item.key}.webp`)"
      class="h-full w-full"
    />
  </Window>
</template>
