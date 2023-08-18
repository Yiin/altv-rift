<script setup lang="ts">
import { ComponentPublicInstance, computed, onBeforeUpdate, ref, toRaw } from "vue";
// import { vClickOutside } from "@/directives/click-outside";
import Window from "@/components/Window.vue";
import { useWindowSize } from "@/composables/use-window-size";
// import DropItemWarning from "./DropItemWarning.vue";
// import ContextMenu from "./ContextMenu.vue";
// import ItemInfo from "./ItemInfo.vue";
import InventorySlot from "./InventorySlot.vue";
// import {
//   InteractionType,
//   useItemInteractions,
// } from "@/composables/use-item-interactions";
import { useInventoryGrid } from "@/composables/use-inventory-grid";
import { useInventory } from "@/store/inventory.store";
import { InventoryItem } from "@shared/interfaces";
// import ItemIcon from "./ItemIcon.vue";
import { isItemEquipable, isItemUsable } from "@shared/modules/items";
import { px } from "@/composables/use-pixel";

const windowSize = useWindowSize();
const inventoryGrid = useInventoryGrid();

// const itemSlotRefs = ref<HTMLElement[]>([]);
// const dropItemWarningRef =
//   ref<ComponentPublicInstance<typeof DropItemWarning>>();

const width = computed(() => px(34) + px(88) * 5);
const inventory = useInventory();

const items = computed(() => inventory.items);

// const {
//   currentInteraction,
//   handleMouseDown,
//   completeDropping,
//   dropFromMenu,
//   cancelDropping,
//   openActionMenu,
//   closeActionMenu,
//   selectedItem,
//   log,
// } = useItemInteractions({
//   items,
//   itemSlotRefs,
//   dropItemWarningRef,
//   moveItem: inventory.moveItem,
//   dropItem: inventory.dropItem,
// });

function useItem(item: InventoryItem) {
  inventory.useItem(item.slot);
}

function equipItem(item: InventoryItem) {
  inventory.equipItem(item.slot);
}

function useOrEquipItem(item: InventoryItem) {
  if (isItemUsable(item.data.key)) {
    useItem(item);
  } else if (isItemEquipable(item.data.key)) {
    equipItem(item);
  }
}

(window as any).map = new Map<any, any>();

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
  <Window parent-limitation :is-active="false" is-draggable :w="width" h="auto" :x="windowSize.width / 2 - width / 2"
    :y="windowSize.height / 2 - px(200)">
    <div class="shadow-md w-full h-full bg-gray-800/95 px-4 py-2">
      <span class="uppercase text-sm tracking-wider text-white">
        Inventory
      </span>
      <div @mousedown.stop @touchstart.stop class="relative">
        <InventorySlot v-for="i in inventory.size" :key="i" :slot="i - 1" :ref="(setInventorySlotRef as any)" />
      </div>
    </div>
  </Window>
  <!-- <Window v-if="currentInteraction?.type === InteractionType.ActionMenu" wrapper class="absolute flex justify-start">
    <ContextMenu v-bind="currentInteraction.state" @use="useItem" @equip="equipItem" @drop="dropFromMenu"
      @close="closeActionMenu" v-click-outside="closeActionMenu" />
  </Window>
  <Window v-if="currentInteraction?.type === InteractionType.Dropping" wrapper>
    <DropItemWarning ref="dropItemWarningRef" class="absolute" :item="currentInteraction.state.item"
      @drop="completeDropping" @keep="cancelDropping" v-click-outside="cancelDropping" :style="{
        left: `${currentInteraction.state.position.x}px`,
        top: `${currentInteraction.state.position.y}px`,
      }
        " />
  </Window>
  <Window v-if="currentInteraction?.type === InteractionType.Hovering" wrapper>
    <ItemInfo :key="currentInteraction.state.item.slot" class="absolute pointer-events-none select-none"
      :item="currentInteraction.state.item" :style="{
        left: `${currentInteraction.state.position.x}px`,
        top: `${currentInteraction.state.position.y}px`,
      }
        " />
  </Window>
  <Window v-if="false" :x="windowSize.width - 650" :y="20" :w="600" :h="windowSize.height">
    <v-sheet class="h-full bg-gray-800/95 px-4 py-2 text-white">
      <span class="uppercase text-sm tracking-wider">
        Log ({{ log.length }})
      </span>
      <div class="flex flex-col-reverse gap-2 mt-4 mb-4 max-h-screen-2/3 overflow-hidden">
        <div v-for=" logEntry  in  log.slice(-40) " :key="logEntry">
          {{ logEntry }}
        </div>
      </div>
    </v-sheet>
  </Window> -->
</template>

<style>
.item-slot {
  background-image: url(./assets/inventory/ItemSlotBackground.png);
  background-size: cover;
}
</style>
