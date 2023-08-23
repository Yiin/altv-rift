<script setup lang="ts">
import { useItemDetails } from "@/composables/use-item-details";
import { getItemIconScale, getItemImage } from "@/utils/items";
import { ItemData } from "@shared/interfaces";
import { computed, ComputedRef, ref, watch } from "vue";
import LogIcon from "./dynamic-icons/LogIcon.vue";

const props = defineProps<{
  item: ItemData;
}>();

const itemData = computed(() => props.item);

const itemDetails = useItemDetails(itemData.value);
const noImage = ref(false);

watch(
  () => itemData,
  () => {
    fetch(getItemImage(itemData.value)).then((result) => {
      console.log(result.status);
      if (result.status === 404) {
        noImage.value = true;
      }
    });
  },
  { immediate: true }
);
</script>

<template>
  <div
    class="absolute top-0 left-0 w-20 h-20 text-white flex items-center justify-center cursor-pointer"
    :style="{
      backgroundImage: `url(${getItemImage(item)})`,
      backgroundSize: getItemIconScale(item),
      backgroundPosition: 'center',
    }"
  >
    <template v-if="noImage">
      <LogIcon v-if="item.key.endsWith(`_logs`)" :item-key="item.key" />
      <div v-else class="text-center text-sm tracking-wider font-bold">
        {{ itemDetails.customName ?? itemDetails.name }}
      </div>
    </template>
    <div
      v-if="itemDetails.data && `amount` in itemDetails.data"
      class="absolute bottom-1 right-1 font-bold shadow-sm"
    >
      {{ itemDetails.data.amount }}
    </div>
  </div>
</template>
