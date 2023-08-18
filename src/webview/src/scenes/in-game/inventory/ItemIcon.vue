<script setup lang="ts">
import { useInventoryGrid } from "@/composables/use-inventory-grid";
import { useItemDetails } from "@/composables/use-item-details";
import { getItemIconScale, getItemImage } from "@/utils/items";
import { InventoryItem } from "@shared/interfaces";
import { computed, ref } from "vue";
import LogIcon from "./dynamic-icons/LogIcon.vue";
import { InteractionType, useInventory } from "@/store/inventory.store";

const props = defineProps<{
  item: InventoryItem;
}>();

const inventory = useInventory();
const inventoryGrid = useInventoryGrid();

const item = computed(() => props.item);
const itemDetails = useItemDetails(item.value.data);
const selected = computed(() => inventory.selectedItem?.slot === item.value.slot);
const noImage = ref(false);

const isDraggingOrDropping = computed(() => [InteractionType.Dragging, InteractionType.Dropping].includes(
  inventory.currentInteraction.type
));

const shouldShow = computed(() => (
  inventory.currentInteraction.type !== InteractionType.Dropping
  || !inventory.currentInteraction.state.outside
  || item.value.slot !== inventory.currentInteraction.state.item.slot
));

const draggingStyle = computed(() => {
  const interaction = inventory.currentInteraction;
  const slotPositionInGrid = inventoryGrid.getSlotPositionInGrid(item.value.slot);

  if (interaction.type === InteractionType.Dragging && interaction.state.item.slot === item.value.slot) {
    const x = interaction.state.currentPosition.x -
      interaction.state.startPosition.x + slotPositionInGrid.x;
    const y = interaction.state.currentPosition.y -
      interaction.state.startPosition.y + slotPositionInGrid.y;

    // We're currently dragging this item
    return {
      transform: `translate(${x}px, ${y}px)`,
      zIndex: Number.MAX_SAFE_INTEGER,
    };
  } else {
    // Item is chilling in its slot
    return {
      transform: `translate(${slotPositionInGrid.x}px, ${slotPositionInGrid.y}px)`
    };
  }
})

fetch(getItemImage(item.value.data)).then((result) => {
  if (result.status === 404) {
    noImage.value = true;
  }
});
</script>

<template>
  <div :class="[
    'absolute top-0 left-0 w-20 h-20 text-white flex items-center justify-center cursor-pointer',
    !isDraggingOrDropping && 'transition-all duration-75',
    selected && 'border-2 border-solid border-white'
  ]" v-show="shouldShow" :style="[
  draggingStyle,
  {
    backgroundImage: `url(${getItemImage(item.data)})`,
    backgroundSize: getItemIconScale(item.data),
    backgroundPosition: 'center',
  },
]">
    <template v-if="noImage">
      <LogIcon v-if="item.data.key.endsWith(`_logs`)" :item-key="item.data.key" />
      <div v-else class="text-center text-sm tracking-wider font-bold">
        {{ itemDetails.customName ?? itemDetails.name }}
      </div>
    </template>
    <div v-if="itemDetails.data && `amount` in itemDetails.data" class="absolute bottom-1 right-1 font-bold shadow-sm">
      {{ itemDetails.data.amount }}
    </div>
  </div>
</template>
