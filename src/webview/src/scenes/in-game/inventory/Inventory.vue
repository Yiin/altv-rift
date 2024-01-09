<script setup lang="ts">
import { effect, onUnmounted } from "vue";
import DropItemWarning from "./DropItemWarning.vue";
import ContextMenu from "./ContextMenu.vue";
import ItemInfo from "./ItemInfo.vue";
import { InteractionType, useInventory } from "@/store/inventory.store";
import { useEventListener } from "@/composables/use-event-listener";
import PlayerEquipment from "./player-equipment/PlayerEquipment.vue";
import PlayerInventory from "./player-inventory/PlayerInventory.vue";
import Shop from "./shop/Shop.vue";
import Storage from "./storage/Storage.vue";
import Confirmation from "./shop/Confirmation.vue";
import ItemPreview from "./item-preview/ItemPreview.vue";
import { useShop } from "@/store/shop.store";

const inventory = useInventory();
const shop = useShop();

useEventListener("mousemove", inventory.handleMouseMove);
useEventListener("mouseup", inventory.handleMouseUp);
useEventListener("click", inventory.handleClick, true);

onUnmounted(() => {
  inventory.$reset();
});
</script>

<template>
  <div class="relative">
    <!-- <TradeWindow class="absolute" :style="{ transform: `translate(35vw, 30vh)` }" /> -->
    <Shop class="absolute" :style="{ transform: `translate(30vw, 30vh)` }" />
    <!-- <Storage class="absolute" :style="{ transform: `translate(30vw, 30vh)` }" /> -->
    <!-- <PlayerEquipment class="absolute" :style="{ transform: `translate(20vw, 30vh)` }" /> -->
    <PlayerInventory class="absolute" :style="{ transform: `translate(62vw, 30vh)` }" />
  </div>

  <ContextMenu v-if="inventory.currentInteraction.type === InteractionType.ContextMenu"
    v-bind="inventory.currentInteraction.state" />
  <DropItemWarning v-if="inventory.currentInteraction.type === InteractionType.Dropping"
    v-bind="inventory.currentInteraction.state" />
  <ItemInfo v-if="inventory.currentInteraction.type === InteractionType.Hovering"
    :key="JSON.stringify(inventory.currentInteraction.state.item.source)" v-bind="inventory.currentInteraction.state" />
  <ItemPreview v-if="inventory.previewingItem" :key="JSON.stringify(inventory.previewingItem.source)"
    v-bind="inventory.previewingItem" />
  <Confirmation v-if="shop.interaction && shop.action" />
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
