<script setup lang="ts">
import { useItemDetails } from "@/composables/use-item-details";
import { getItemIconScale, getItemImage, getItemIconPosition, getItemClasses } from "@/utils/items";
import { InteractionType, useInventory } from "@/store/inventory.store";
import { computed, ref, watch } from "vue";
import LogIcon from "./dynamic-icons/LogIcon.vue";
import { Item, TreeLogItemKey } from "@shared/modules/items";

const props = defineProps<{
  item: Item;
}>();

const item = computed(() => props.item);
const inventory = useInventory();

const itemDetails = useItemDetails(item);
const noImage = ref(false);

watch(
  () => item,
  () => {
    fetch(getItemImage(item.value)).then((result) => {
      if (result.status === 404) {
        noImage.value = true;
      } else {
        noImage.value = false;
      }
    });
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="absolute top-0 left-0 w-20 h-20 text-white flex items-center justify-center cursor-pointer p-2">
    <template v-if="noImage">
      <LogIcon v-if="item.key.endsWith(`_logs`)" :item-key="(item.key as TreeLogItemKey)" />
      <div v-else class="text-center text-sm tracking-wider font-bold">
        {{ itemDetails.customName ?? itemDetails.name }}
      </div>
    </template>
    <div v-else class="relative w-full h-full" :class="[getItemClasses(item)]" :style="{
      backgroundImage: `url(${getItemImage(item)})`,
      backgroundSize: getItemIconScale(item),
      backgroundPosition: getItemIconPosition(item),
    }" />
    <div v-if="`amount` in item" class="absolute bottom-1 right-1 font-bold shadow-sm">
      {{ item.amount }}
    </div>
  </div>
</template>

<style scoped>
.image-shadow::before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  background: inherit;
  background-position: center center;
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 1)) blur(11px);
  z-index: -1;
}
</style>
