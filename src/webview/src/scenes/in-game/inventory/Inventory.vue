<script setup lang="ts">
import { computed, onBeforeUpdate } from "vue";
import Window from "@/components/Window.vue";
import { useWindowSize } from "@/composables/use-window-size";
import DropItemWarning from "./DropItemWarning.vue";
import ContextMenu from "./ContextMenu.vue";
import ItemInfo from "./ItemInfo.vue";
import InventorySlot from "./InventorySlot.vue";
import { InteractionType, useInventory } from "@/store/inventory.store";
import { px } from "@/composables/use-pixel";
import { useEventListener } from "@/composables/use-event-listener";
import EquipmentMenu from "./equipment/EquipmentMenu.vue";

const windowSize = useWindowSize();

const inventory = useInventory();

const width = computed(() => px(90) * 5 - px(10));
const height = computed(() => ~~(inventory.size / 5) * px(90) - px(10));

useEventListener("mousemove", inventory.handleMouseMove);
useEventListener("mouseup", inventory.handleMouseUp);
useEventListener("click", inventory.handleClick, true);

function setInventorySlotRef(ref: InstanceType<typeof InventorySlot> | null) {
  if (ref?.node) {
    inventory.inventoryItemRefs.push(ref.node);
  }
}

onBeforeUpdate(() => {
  inventory.inventoryItemRefs = [];
});
</script>

<template>
  <Window
    parent-limitation
    :is-active="false"
    is-draggable
    w="auto"
    h="auto"
    :x="px(windowSize.width / 2 - width / 2)"
    :y="px(windowSize.height / 2 - 200)"
  >
    <div class="shadow-md flex gap-4 h-full bg-gray-800/95 px-4 py-4">
      <EquipmentMenu :style="{ width: `${width}px` }" />
      <div
        @mousedown.stop
        @touchstart.stop
        class="relative"
        :style="{ width: `${width}px`, height: `${height}px` }"
      >
        <InventorySlot
          v-for="i in inventory.size"
          :key="i"
          :slot="i - 1"
          :ref="(setInventorySlotRef as any)"
        />
      </div>
    </div>
  </Window>
  <ContextMenu
    v-if="inventory.currentInteraction.type === InteractionType.ContextMenu"
    v-bind="inventory.currentInteraction.state"
  />
  <DropItemWarning
    v-if="inventory.currentInteraction.type === InteractionType.Dropping"
    v-bind="inventory.currentInteraction.state"
  />
  <ItemInfo
    v-if="inventory.currentInteraction.type === InteractionType.Hovering"
    :key="inventory.currentInteraction.state.item.slot"
    v-bind="inventory.currentInteraction.state"
  />
</template>

<style>
.item-slot {
  background-image: url(./assets/inventory/ItemSlotBackground.png);
  background-size: cover;
}
</style>
