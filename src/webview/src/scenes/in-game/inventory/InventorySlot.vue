<script setup lang="ts">
import { computed, ref } from "vue";
import { InteractionType, SlottedItem, isSameItemSource, useInventory } from "@/store/inventory.store";
import InventoryItemIcon from "./InventoryItemIcon.vue";
import { isItemUsable, isItemEquipable } from "@shared/modules/items";
import { isItemPreviewable } from "@shared/modules/items/lib/is-item-previewable";
import { useCombinableItem } from "@/composables/use-combinable-item";
import { InventoryItemSource } from "@shared/interfaces";

const props = defineProps<{
  source: InventoryItemSource;
}>();

const inventory = useInventory();

const nodeRef = ref<HTMLDivElement>();

const item = computed(() =>
  inventory.items.find(
    (item): item is SlottedItem<InventoryItemSource> => isSameItemSource(item.source, props.source)
  )
);

const { combinableWithHoveredItem, combinableWithOtherItems } = useCombinableItem(item);

const dragging = computed(
  () =>
    inventory.currentInteraction.type === InteractionType.Dragging &&
    isSameItemSource(inventory.currentInteraction.state.item.source, props.source)
);

const selected = computed(
  () =>
    isSameItemSource(inventory.selectedItem?.source, props.source)
);

const draggingOver = computed(() => {
  const interaction = inventory.currentInteraction;

  if (interaction.type === InteractionType.Dragging) {
    const currentCursorPos = interaction.state.currentPosition;

    const nodeRect = nodeRef.value?.parentElement?.getBoundingClientRect();

    if (!nodeRect) {
      return false;
    }

    return (
      currentCursorPos.x > nodeRect.left &&
      currentCursorPos.x <= nodeRect.right &&
      currentCursorPos.y > nodeRect.top &&
      currentCursorPos.y <= nodeRect.bottom
    );
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
  } else if (isItemPreviewable(item.value.item.key)) {
    inventory.previewingItem = item.value;
  }
}

inventory.registerItemSlot({
  source: props.source,
  node: nodeRef,
});
</script>

<template>
  <div :key="props.source.inventorySlot"
    class="node-anchor h-21 w-21 border border-solid border-white/[0.03] relative" :class="[
      combinableWithHoveredItem || combinableWithOtherItems ? `bg-silverCloud/5` : `bg-silverCloud/[0.01]`,
    ]">
    <div ref="nodeRef" class="h-19 w-19 border-2 border-solid" :class="{
      'drop-shadow-[0px_0px_6px_black] scale-105': draggingOver || (item && !dragging),
      'border-white/50': selected,
      'border-transparent': !selected
    }">
      <InventoryItemIcon v-if="item" :item="item" @dblclick="useOrEquipItem"
        @contextmenu.prevent="(e) => item && inventory.openContextMenu(item, e)" />
    </div>
  </div>
</template>
