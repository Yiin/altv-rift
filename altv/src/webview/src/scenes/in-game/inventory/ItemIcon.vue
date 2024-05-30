<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { type Item, ItemGrade, type TreeLogItemKey } from "@shared/modules/items";
import { useItemDetails } from "@/composables/use-item-details";
import {
  getItemImage,
  getItemIconPosition,
  getItemClasses,
  getItemGradeTextColor,
} from "@/utils/items";
import { px } from "@/composables/use-pixel";
import LogIcon from "./dynamic-icons/LogIcon.vue";

const props = defineProps<{
  item: Item;
  width?: string;
  height?: string;
  hideAmount?: boolean;
}>();

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
    class="relative flex items-center justify-center p-2 text-left text-white"
    :style="{
      width: width ?? `${px(80)}px`,
      height: height ?? `${px(80)}px`,
    }"
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
      v-if="'grade' in item"
      class="absolute right-2 top-0 font-mono text-lg font-extrabold uppercase"
      :class="getItemGradeTextColor(item.grade)"
    >
      •
    </p>
    <p
      v-else-if="
        ['common_', 'uncommon_', 'rare_', 'epic_', 'legendary_'].some((grade) =>
          item.key.startsWith(grade),
        )
      "
      class="absolute right-2 top-0 font-mono text-lg font-extrabold uppercase"
      :class="
        {
          [ItemGrade.COMMON]: `text-common`,
          [ItemGrade.UNCOMMON]: `text-uncommon`,
          [ItemGrade.RARE]: `text-rare`,
          [ItemGrade.EPIC]: `text-epic`,
          [ItemGrade.LEGENDARY]: `text-legendary`,
          [ItemGrade.CONTRABAND]: `text-contraband`,
          [ItemGrade.LIMITED]: `text-limited`,
        }[item.key.split(`_`)[0]]
      "
    >
      •
    </p>
    <div
      v-if="`amount` in item && !hideAmount"
      class="crisp-shadow absolute bottom-1 right-1 font-bold shadow-sm"
    >
      {{ item.amount }}
    </div>
  </div>
</template>
