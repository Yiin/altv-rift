<script setup lang="ts">
import { useInventoryGrid } from "@/composables/use-inventory-grid";
import { useItemDetails } from "@/composables/use-item-details";
import { InteractionType, ItemInteraction } from "@/composables/use-item-interactions";
import { getItemIconScale, getItemImage } from "@/utils/items";
import { InventoryItem } from "@shared/interfaces";
import { computed, ref } from "vue";
import LogIcon from "./dynamic-icons/LogIcon.vue";

const props = defineProps<{
  item: InventoryItem;
  currentInteraction?: ItemInteraction;
  selected: boolean;
  selectedItem?: InventoryItem;
}>();

const inventoryGrid = useInventoryGrid();

const item = computed(() => props.item);
const itemDetails = useItemDetails(item.value.data);

const noImage = ref(false);

fetch(getItemImage(item.value.data)).then((result) => {
  if (result.status === 404) {
    noImage.value = true;
  }
});
</script>

<template>
  <div
    :class="[
      'absolute top-0 left-0 w-20 h-20 text-white flex items-center justify-center cursor-pointer',
      ![InteractionType.Dragging, InteractionType.Dropping].includes(
        currentInteraction?.type!
      ) && 'transition-all duration-75',
      selected && 'border-2 border-solid border-white'
    ]"
    v-show="
      currentInteraction?.type !== InteractionType.Dropping ||
      !currentInteraction?.state.outside ||
      item.slot !== currentInteraction?.state.item.slot
    "
    :style="[
      currentInteraction?.type === InteractionType.Dragging &&
      currentInteraction.state.item.slot === item.slot
        ? {
            transform: `translate(${
              currentInteraction.state.currentPosition.x -
              currentInteraction.state.startPosition.x +
              inventoryGrid.getSlotPositionInGrid(currentInteraction.state.item.slot).x
            }px, ${
              currentInteraction.state.currentPosition.y -
              currentInteraction.state.startPosition.y +
              inventoryGrid.getSlotPositionInGrid(currentInteraction.state.item.slot).y
            }px)`,
            zIndex: Number.MAX_SAFE_INTEGER,
          }
        : {
            transform: `translate(${inventoryGrid.getSlotPositionInGrid(item.slot).x}px, ${
              inventoryGrid.getSlotPositionInGrid(item.slot).y
            }px)`,
          },
      {
        backgroundImage: `url(${getItemImage(item.data)})`,
        backgroundSize: getItemIconScale(item.data),
        backgroundPosition: 'center',
      },
    ]"
  >
    <template v-if="noImage">
      <LogIcon v-if="item.data.key.endsWith(`_logs`)" :item-key="item.data.key" />
      <div v-else class="text-center text-sm tracking-wider font-bold">
        {{ itemDetails.customName ?? itemDetails.name }}
      </div>
    </template>
    <div v-if="itemDetails.data && `amount` in itemDetails.data" class="absolute bottom-1 right-1">
      {{ itemDetails.data.amount }}
    </div>
  </div>
</template>
