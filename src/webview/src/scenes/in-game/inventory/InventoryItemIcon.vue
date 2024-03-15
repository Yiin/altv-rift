<script setup lang="ts">
import { computed } from "vue";
import {
  InteractionType,
  type SlottedGroundItem,
  type SlottedStorageItem,
  type SlottedPlayerInventoryItem,
  isSameItemSource,
  useInventory,
} from "@/store/inventory.store";
import ItemIcon from "./ItemIcon.vue";

const props = defineProps<{
  item: SlottedPlayerInventoryItem | SlottedStorageItem | SlottedGroundItem;
}>();

const inventory = useInventory();

const slottedItem = computed(() => props.item);

const isDraggingOrDropping = computed(() =>
  [InteractionType.Dragging, InteractionType.TransferingAmount].includes(
    inventory.currentInteraction.type,
  ),
);

const shouldShow = computed(
  () =>
    inventory.currentInteraction.type !== InteractionType.TransferingAmount ||
    !inventory.currentInteraction.state.outside ||
    !isSameItemSource(slottedItem.value.source, inventory.currentInteraction.state.item.source),
);

const draggingStyle = computed(() => {
  const interaction = inventory.currentInteraction;

  if (
    interaction.type === InteractionType.Dragging &&
    !interaction.maybe &&
    isSameItemSource(interaction.state.item.source, slottedItem.value.source)
  ) {
    const x = interaction.state.currentPosition.x - interaction.state.startPosition.x;
    const y = interaction.state.currentPosition.y - interaction.state.startPosition.y;

    // We're currently dragging this item
    return {
      transform: `translate(${x}px, ${y}px)`,
      zIndex: Number.MAX_SAFE_INTEGER,
      opacity: interaction.hidden ? "0" : "1",
    };
  } else {
    // Item is chilling in its slot
    return {
      zIndex: 10,
    };
  }
});
</script>

<template>
  <ItemIcon
    :item="slottedItem.item"
    :class="{ 'transition-transform duration-75': !isDraggingOrDropping }"
    v-show="shouldShow"
    :style="[draggingStyle]"
  />
</template>
