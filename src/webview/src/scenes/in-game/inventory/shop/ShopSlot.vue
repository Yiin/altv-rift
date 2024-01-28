<script setup lang="ts">
import { computed, effect, ref } from "vue";
import { useInventory, InteractionType, isSameItemSource } from "@/store/inventory.store";
import { InventoryItem, InventorySource } from "@shared/interfaces";
import ItemIcon from "../ItemIcon.vue";

const props = defineProps<{
  shop: {
    source: InventorySource;
    size: number;
    items: InventoryItem[];
  };
  slot: number;
}>();

const inventory = useInventory();

const nodeRef = ref<HTMLDivElement>();

const item = computed(() =>
  inventory.items.find(
    (item) =>
      isSameItemSource(item.source, {
        type: "interaction",
        inventorySlot: props.slot,
        ...props.shop.source,
      })
  )
);

effect(() => {
  console.log({
    slot: props.slot,
    item: item.value,
    itemSource: item.value,
  });
});

const draggingStyle = computed(() => {
  if (!item.value) {
    return {};
  }

  const interaction = inventory.currentInteraction;
  const slotPositionInGrid = inventory.getItemRelativeScreenPositionFromSource(item.value.source);

  if (!slotPositionInGrid.x && !slotPositionInGrid.y) {
    return {};
  }

  if (
    interaction.type === InteractionType.Dragging &&
    isSameItemSource(interaction.state.item.source, item.value.source)
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

inventory.registerItemSlot({
  source: {
    origin: "interaction",
    inventorySlot: props.slot,
  },
  node: nodeRef,
});
</script>

<template>
  <div :key="slot" class="p-1 node-anchor">
    <div ref="nodeRef" class="w-20 h-20 bg-black/30 item-slot text-white" />
  </div>
  <ItemIcon
    v-if="item"
    :item="item.item"
    :style="draggingStyle"
    @mousedown="inventory.handleMouseDown"
    @contextmenu.prevent="(e) => item && inventory.openContextMenu(item, e)" />
</template>
