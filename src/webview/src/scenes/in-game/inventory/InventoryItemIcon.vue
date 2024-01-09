<script setup lang="ts">
import { computed } from "vue";
import { InteractionType, SlottedPlayerInventoryItem, isSameSource, useInventory } from "@/store/inventory.store";
import ItemIcon from "./ItemIcon.vue";

const props = defineProps<{
  item: SlottedPlayerInventoryItem;
}>();

const inventory = useInventory();

const slottedItem = computed(() => props.item);

const isDraggingOrDropping = computed(() =>
  [InteractionType.Dragging, InteractionType.Dropping].includes(inventory.currentInteraction.type)
);

const shouldShow = computed(
  () =>
    inventory.currentInteraction.type !== InteractionType.Dropping ||
    !inventory.currentInteraction.state.outside ||
    !isSameSource(slottedItem.value.source, inventory.currentInteraction.state.item.source)
);

const draggingStyle = computed(() => {
  const interaction = inventory.currentInteraction;
  const slotPositionInGrid = inventory.getItemRelativeScreenPositionFromSource(slottedItem.value.source);

  if (!slotPositionInGrid.x && !slotPositionInGrid.y) {
    return {};
  }

  if (
    interaction.type === InteractionType.Dragging &&
    isSameSource(interaction.state.item.source, slottedItem.value.source)
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
  <ItemIcon :item="slottedItem.item" :class="{ 'transition-transform duration-75': !isDraggingOrDropping }"
    v-show="shouldShow" :style="[draggingStyle]" />
</template>
