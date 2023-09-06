<script setup lang="ts">
import { computed, ref } from "vue";
import { useInventoryGrid } from "@/composables/use-inventory-grid";
import { InteractionType, SlottedItem, isSameSource, useInventory } from "@/store/inventory.store";
import InventoryItemIcon from "./InventoryItemIcon.vue";
import { isItemUsable, isItemEquipable, getCombineType, CombineType } from "@shared/modules/items";
import { LocalInventoryItemSource } from "@shared/interfaces";

const props = defineProps<{
  slot: number;
}>();

const inventoryGrid = useInventoryGrid();
const inventory = useInventory();

const nodeRef = ref<HTMLDivElement>();

const pos = computed(() => inventoryGrid.getSlotPositionInGrid(props.slot));
const item = computed(() =>
  inventory.items.find(
    (item): item is SlottedItem<LocalInventoryItemSource> =>
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

const draggingOver = computed(() => {
  const interaction = inventory.currentInteraction;

  if (interaction.type === InteractionType.Dragging) {
    const currentCursorPos = interaction.state.currentPosition;

    const nodeRect = nodeRef.value?.getBoundingClientRect();

    if (!nodeRect) {
      return false;
    }

    return (
      currentCursorPos.x >= nodeRect.left &&
      currentCursorPos.x <= nodeRect.right &&
      currentCursorPos.y >= nodeRect.top &&
      currentCursorPos.y <= nodeRect.bottom
    );
  }

  return false;
});

const hoveredItem = computed(() => {
  const interaction = inventory.currentInteraction;

  const hoveredItem =
    inventory.selectedItem ??
    (interaction.type === InteractionType.Hovering || interaction.type === InteractionType.Dragging
      ? interaction.state.item
      : null);

  return hoveredItem;
});

const combinableWithHoveredItem = computed(() => {
  if (!item.value) {
    return false;
  }

  if (!hoveredItem.value) {
    return false;
  }

  if (isSameSource(hoveredItem.value.source, { type: "inventory", inventorySlot: props.slot })) {
    return false;
  }

  const [combineType, reverse] = getCombineType(item.value.item.key, hoveredItem.value.item.key);

  return combineType !== CombineType.None;
});

const combinableWithOtherItems = computed(() => {
  if (!item.value) {
    return false;
  }

  if (!hoveredItem.value) {
    return false;
  }

  if (!isSameSource(hoveredItem.value.source, { type: "inventory", inventorySlot: props.slot })) {
    return false;
  }

  return inventory.items.some(
    ({ item: { key } }) => getCombineType(key, item.value!.item.key)[0] !== CombineType.None
  );
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

inventory.registerItemSlot({
  source: {
    type: "inventory",
    inventorySlot: props.slot,
  },
  node: nodeRef,
});
</script>

<template>
  <div
    ref="nodeRef"
    :key="slot"
    class="absolute top-0 left-0 p-1 pr-[0.3125rem] transform"
    :style="{
      '--tw-translate-x': `${pos.x}px`,
      '--tw-translate-y': `${pos.y}px`,
    }"
  >
    <div
      class="w-20 h-20 bg-gray-800/80 item-slot text-white"
      :class="{
        'drop-shadow-[0px_0px_6px_black] scale-105': draggingOver || (item && !dragging),
        'border-2 border-solid border-yellow-500': combinableWithHoveredItem,
        'border-2 border-solid border-gray-400': combinableWithOtherItems,
        'item-slot--selected': selected,
      }"
    ></div>
  </div>
  <InventoryItemIcon
    v-if="item"
    :item="item"
    @mousedown="inventory.handleMouseDown"
    @dblclick="useOrEquipItem"
    @contextmenu.prevent="(e) => item && inventory.openContextMenu(item, e)"
  />
</template>
