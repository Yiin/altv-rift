<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { type Item, ItemGrade, type TreeLogItemKey } from "@shared/modules/items";
import { useItemDetails } from "@/composables/use-item-details";
import { getItemImage, getItemIconPosition, getItemClasses } from "@/utils/items";
import { px } from "@/composables/use-pixel";
import LogIcon from "./dynamic-icons/LogIcon.vue";

const props = withDefaults(
  defineProps<{
    item: Item;
    width?: number;
    height?: number;
    hideAmount?: boolean;
  }>(),
  {
    width: px(80),
    height: px(80),
  },
);

const item = computed(() => props.item);

const itemDetails = useItemDetails(item);
const noImage = ref(false);

watch(
  () => item,
  () => {
    if (item.value?.key.endsWith(`_logs`)) {
      noImage.value = true;
      return;
    }

    fetch(getItemImage(item.value.key)).then((result) => {
      if (result.status === 404) {
        noImage.value = true;
      } else {
        noImage.value = false;
      }
    });
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div
    class="relative flex items-center justify-center p-2 text-white"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <template v-if="noImage">
      <LogIcon
        v-if="item.key.endsWith(`_logs`)"
        :item-key="item.key as TreeLogItemKey"
      />
      <div
        v-else
        class="z-max text-center text-sm font-bold tracking-wider"
      >
        {{ itemDetails.customName ?? itemDetails.name }}
      </div>
    </template>
    <div
      v-else
      class="relative h-full w-full bg-contain"
      :class="[getItemClasses(item)]"
      :style="{
        backgroundImage: `url(${getItemImage(item.key)})`,
        backgroundPosition: getItemIconPosition(item),
      }"
    />
    <p
      v-if="'grade' in item && item.grade"
      class="absolute left-2 top-1 w-full font-mono text-lg font-extrabold uppercase"
      :class="
        {
          [ItemGrade.ONE]: `text-gray-300`,
          [ItemGrade.TWO]: `text-yellow-400`,
          [ItemGrade.THREE]: `text-main-500`,
          [ItemGrade.FOUR]: `text-red-500`,
        }[item.grade]
      "
    >
      {{ item.grade }}
    </p>
    <div
      v-if="`amount` in item && !hideAmount"
      class="crisp-shadow absolute bottom-1 right-1 font-bold shadow-sm"
    >
      {{ item.amount }}
    </div>
  </div>
</template>
