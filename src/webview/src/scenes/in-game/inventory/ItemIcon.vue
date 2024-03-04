<script setup lang="ts">
import { useItemDetails } from "@/composables/use-item-details";
import { getItemIconScale, getItemImage, getItemIconPosition, getItemClasses } from "@/utils/items";
import { computed, ref, watch } from "vue";
import LogIcon from "./dynamic-icons/LogIcon.vue";
import { Item, ItemGrade, TreeLogItemKey } from "@shared/modules/items";

const props = defineProps<{
  item: Item;
}>();

const item = computed(() => props.item);

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
  <div class="relative w-20 h-20 text-white flex items-center justify-center p-2">
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
    <p v-if="'grade' in item && item.grade"
      class="absolute uppercase text-lg font-extrabold font-mono w-full top-1 left-2" :class="{
        [ItemGrade.ONE]: `text-gray-300`,
        [ItemGrade.TWO]: `text-yellow-400`,
        [ItemGrade.THREE]: `text-main-500`,
        [ItemGrade.FOUR]: `text-red-500`,
      }[item.grade]">{{ item.grade }}</p>
    <div v-if="`amount` in item" class="absolute bottom-1 right-1 font-bold shadow-sm">
      {{ item.amount }}
    </div>
  </div>
</template>
