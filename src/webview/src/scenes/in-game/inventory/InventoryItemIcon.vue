<script setup lang="ts">
import { useInventoryGrid } from "@/composables/use-inventory-grid";
import { InventoryItem } from "@shared/interfaces";
import { computed } from "vue";
import { InteractionType, useInventory } from "@/store/inventory.store";
import ItemIcon from "./ItemIcon.vue";

const props = defineProps<{
  item: InventoryItem;
}>();

const inventory = useInventory();
const inventoryGrid = useInventoryGrid();

const item = computed(() => props.item);

const isDraggingOrDropping = computed(() =>
  [InteractionType.Dragging, InteractionType.Dropping].includes(inventory.currentInteraction.type)
);

const shouldShow = computed(
  () =>
    inventory.currentInteraction.type !== InteractionType.Dropping ||
    !inventory.currentInteraction.state.outside ||
    item.value.slot !== inventory.currentInteraction.state.item.slot
);

const draggingStyle = computed(() => {
  const interaction = inventory.currentInteraction;
  const slotPositionInGrid = inventoryGrid.getSlotPositionInGrid(item.value.slot);

  if (
    interaction.type === InteractionType.Dragging &&
    interaction.state.item.slot === item.value.slot
  ) {
    const x =
      interaction.state.currentPosition.x -
      interaction.state.startPosition.x +
      slotPositionInGrid.x;
    const y =
      interaction.state.currentPosition.y -
      interaction.state.startPosition.y +
      slotPositionInGrid.y;

    // We're currently dragging this item
    return {
      transform: `translate(${x}px, ${y}px)`,
      zIndex: Number.MAX_SAFE_INTEGER,
    };
  } else {
    // Item is chilling in its slot
    return {
      transform: `translate(${slotPositionInGrid.x}px, ${slotPositionInGrid.y}px)`,
      zIndex: 10,
    };
  }
});
</script>

<template>
  <ItemIcon
    :item="item.data"
    :class="{ 'transition-all duration-75': !isDraggingOrDropping }"
    v-show="shouldShow"
    :style="[draggingStyle]"
  />
</template>
