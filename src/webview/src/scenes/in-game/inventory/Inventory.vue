<script setup lang="ts">
import { onUnmounted } from "vue";
import DropItemWarning from "./DropItemWarning.vue";
import ContextMenu from "./ContextMenu.vue";
import ItemInfo from "./ItemInfo.vue";
import { InteractionType, useInventory } from "@/store/inventory.store";
import { useEventListener } from "@/composables/use-event-listener";
import PlayerEquipment from "./player-equipment/PlayerEquipment.vue";
import PlayerInventory from "./player-inventory/PlayerInventory.vue";
import { useClient } from "@/store/synced/client.store";

const client = useClient();
const inventory = useInventory();

useEventListener("mousemove", inventory.handleMouseMove);
useEventListener("mouseup", inventory.handleMouseUp);
useEventListener("click", inventory.handleClick, true);

onUnmounted(() => {
  inventory.$reset();
});
</script>

<template>
  <!-- <TradeWindow class="absolute" :style="{ transform: `translate(35vw, 30vh)` }" /> -->
  <!-- <ShopInventory class="absolute" :style="{ transform: `translate(35vw, 30vh)` }" /> -->
  <!-- <StorageInventory class="absolute" :style="{ transform: `translate(35vw, 30vh)` }" /> -->
  <PlayerEquipment v-if="client.ui.window?.interaction === null" class="absolute"
    :style="{ transform: `translate(35vw, 30vh)` }" />
  <PlayerInventory class="absolute" :style="{ transform: `translate(62vw, 30vh)` }" />

  <ContextMenu v-if="inventory.currentInteraction.type === InteractionType.ContextMenu"
    v-bind="inventory.currentInteraction.state" />
  <DropItemWarning v-if="inventory.currentInteraction.type === InteractionType.Dropping"
    v-bind="inventory.currentInteraction.state" />
  <ItemInfo v-if="inventory.currentInteraction.type === InteractionType.Hovering"
    :key="JSON.stringify(inventory.currentInteraction.state.item.source)" v-bind="inventory.currentInteraction.state" />
</template>

<style>
.item-slot:not(.item-slot--selected) {
  background-image: url(./assets/inventory/ItemSlotBackground.png);
  background-size: cover;
}

.item-slot--selected {
  background-image: url(./assets/inventory/ItemSlotBackgroundSelected.png);
  background-size: cover;
}
</style>
