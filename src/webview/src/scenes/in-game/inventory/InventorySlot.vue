<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { onUnmounted } from "vue";
import { isItemUsable, isItemEquipable } from "@shared/modules/items";
import { isItemPreviewable } from "@shared/modules/items/lib/is-item-previewable";
import {
  ItemSourceOrigin,
  type GroundItemSource,
  type InventoryItemSource,
} from "@shared/interfaces";
import { useCombinableItem } from "@/composables/use-combinable-item";
import {
  InteractionType,
  type SlottedGroundItem,
  type SlottedStorageItem,
  type SlottedPlayerInventoryItem,
  isSameItemSource,
  useInventory,
} from "@/store/inventory.store";
import ItemIcon from "./ItemIcon.vue";
import InventoryItemIcon from "./InventoryItemIcon.vue";

const props = defineProps<{
  source: InventoryItemSource | GroundItemSource;
}>();

const {
  items,
  currentInteraction,
  selectedItem,
  previewingItem,
  openContextMenu,
  getItemSourceFromScreenPos,
  useItem,
  equipItem,
  registerItemSlot,
  unregisterItemSlot,
} = useInventory();

const nodeRef = ref<HTMLDivElement>();

const item = computed(() =>
  items.value.find(
    (item): item is SlottedPlayerInventoryItem | SlottedStorageItem | SlottedGroundItem =>
      isSameItemSource(item.source, props.source),
  ),
);

const { combinableWithHoveredItem, combinableWithOtherItems } = useCombinableItem(item);

const dragging = computed(
  () =>
    currentInteraction.value.type === InteractionType.Dragging &&
    !currentInteraction.value.maybe &&
    isSameItemSource(currentInteraction.value.state.item.source, props.source),
);

const selected = computed(() => isSameItemSource(selectedItem.value?.source, props.source));

const draggingOver = computed(() => {
  const interaction = currentInteraction.value;

  if (interaction.type === InteractionType.Dragging && !interaction.maybe) {
    const currentCursorPos = interaction.state.currentPosition;
    const itemSource = getItemSourceFromScreenPos(currentCursorPos.x, currentCursorPos.y);

    if (!itemSource) {
      return false;
    }

    if (!isSameItemSource(itemSource, props.source)) {
      return false;
    }

    if (itemSource.origin === ItemSourceOrigin.Ground) {
      return false;
    }

    return interaction.state;
  }

  return false;
});

function useOrEquipItem() {
  if (!item.value) {
    return;
  }
  if (isItemUsable(item.value.item.key)) {
    useItem(item.value.source);
  } else if (isItemEquipable(item.value.item.key)) {
    equipItem(item.value.source);
  } else if (isItemPreviewable(item.value.item.key)) {
    previewingItem.value = item.value;
  }
}

const itemSlot = {
  source: props.source,
  node: nodeRef,
};

onMounted(() => {
  registerItemSlot(itemSlot);
});

onUnmounted(() => {
  unregisterItemSlot(itemSlot);
});
</script>

<template>
  <div
    class="node-anchor relative h-21 w-21 border border-solid border-white/[0.03]"
    :class="[
      combinableWithHoveredItem || combinableWithOtherItems
        ? `bg-silverCloud/5`
        : `bg-silverCloud/[0.01]`,
    ]"
  >
    <div
      ref="nodeRef"
      class="h-21.25 w-21.25 border-2 border-solid"
      :class="{
        'scale-105 drop-shadow-[0px_0px_3px_#000000AA]': draggingOver || (item && !dragging),
        'border-white/50': selected,
        'border-transparent': !selected,
      }"
    >
      <InventoryItemIcon
        v-if="item"
        :item="item"
        @dblclick="useOrEquipItem"
        @contextmenu.prevent="(e) => item && openContextMenu(item, e)"
      />
      <ItemIcon
        v-else-if="draggingOver"
        :item="draggingOver.item.item"
        class="opacity-25"
      />
    </div>
  </div>
</template>
