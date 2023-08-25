<script setup lang="ts">
import { computed, ref } from "vue";
import { useInventoryGrid } from "@/composables/use-inventory-grid";
import { InteractionType, SlottedItem, useInventory } from "@/store/inventory.store";
import InventoryItemIcon from "./InventoryItemIcon.vue";
import { isItemUsable, isItemEquipable } from "@shared/modules/items";
import { px } from "@/composables/use-pixel";
import { InventorySource } from "@shared/interfaces";

const props = defineProps<{
  slot: number;
}>();

const inventoryGrid = useInventoryGrid();
const inventory = useInventory();

const nodeRef = ref<HTMLDivElement>();

const pos = computed(() => inventoryGrid.getSlotPositionInGrid(props.slot));
const item = computed(() =>
  inventory.items.find(
    (item): item is SlottedItem<InventorySource> =>
      item.source.type === "inventory" && item.source.inventorySlot === props.slot
  )
);

const dragging = computed(
  () =>
    inventory.currentInteraction.type === InteractionType.Dragging &&
    inventory.currentInteraction.state.item.source.type === "inventory" &&
    inventory.currentInteraction.state.item.source.inventorySlot === props.slot
);

const selected = computed(
  () =>
    inventory.selectedItem?.source.type === "inventory" &&
    inventory.selectedItem.source.inventorySlot === props.slot
);

const hoveringOver = computed(() => {
  const interaction = inventory.currentInteraction;

  if (
    interaction.type === InteractionType.Dragging &&
    interaction.state.item.source.type === "inventory"
  ) {
    const { source } = interaction.state.item;
    const startingSlotPos = inventoryGrid.getSlotPositionInGrid(source.inventorySlot);
    const startingSlotScreenPos = inventory.getItemSourceScreenPosition(source);
    const x =
      interaction.state.currentPosition.x -
      interaction.state.startPosition.x +
      startingSlotPos.x +
      (interaction.state.startPosition.x - startingSlotScreenPos.x);
    const y =
      interaction.state.currentPosition.y -
      interaction.state.startPosition.y +
      startingSlotPos.y +
      (interaction.state.startPosition.y - startingSlotScreenPos.y);

    const isHoveringOver =
      inventory.currentInteraction.type === InteractionType.Dragging &&
      x > pos.value.x - px(5) &&
      x <= pos.value.x + px(85) &&
      y > pos.value.y - px(5) &&
      y <= pos.value.y + px(85);

    return isHoveringOver;
  }

  return false;
});

function useOrEquipItem() {
  if (!item.value) {
    return;
  }
  if (isItemUsable(item.value.item.key)) {
    inventory.useItem(item.value.source);
  } else if (isItemEquipable(item.value.item.key)) {
    inventory.equipItem(item.value.source);
  }
}

defineExpose({
  node: nodeRef,
  slot: props.slot,
});
</script>

<template>
  <div
    ref="nodeRef"
    :key="slot"
    class="absolute top-0 left-0 w-20 h-20 bg-gray-800/80 item-slot text-white transform"
    :class="{
      'drop-shadow-[2px_4px_6px_black] scale-105': hoveringOver || (item && !dragging),
      'item-slot--selected': selected,
    }"
    :style="{
      '--tw-translate-x': `${pos.x}px`,
      '--tw-translate-y': `${pos.y}px`,
    }"
  />
  <InventoryItemIcon
    v-if="item"
    :item="item"
    @mousedown="inventory.handleMouseDown"
    @dblclick="useOrEquipItem"
    @contextmenu.prevent="(e) => item && inventory.openContextMenu(item, e)"
  />
</template>
