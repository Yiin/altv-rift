<script setup lang="ts">
import { effect, onUnmounted, ref } from "vue";
import Icon from "../../../components/Icon/Icon.vue";
import DropItemWarning from "./DropItemWarning.vue";
import ContextMenu from "./ContextMenu.vue";
import ItemInfo from "./ItemInfo.vue";
import { InteractionType, useInventory } from "@/store/inventory.store";
import { useEventListener } from "@/composables/use-event-listener";
import PlayerEquipment from "./player-equipment/PlayerEquipment.vue";
import EquipmentSlot from "./player-equipment/EquipmentSlot.vue";
import PlayerInventory from "./player-inventory/PlayerInventory.vue";
import InventorySlot from "./InventorySlot.vue";
import Shop from "./shop/Shop.vue";
import Storage from "./storage/Storage.vue";
import Confirmation from "./shop/Confirmation.vue";
import ItemPreview from "./item-preview/ItemPreview.vue";
import { useShop } from "@/store/shop.store";
import { useGapSize } from "@/composables/use-gap-size";
import { ItemSourceType } from "@shared/interfaces";

const inventory = useInventory();
const shop = useShop();

const containerRef = ref<HTMLDivElement>();
const { gapSize, widths } = useGapSize(containerRef);

useEventListener("mousedown", inventory.handleMouseDown);
useEventListener("mousemove", inventory.handleMouseMove);
useEventListener("mouseup", inventory.handleMouseUp);
useEventListener("click", inventory.handleClick, true);

onUnmounted(() => {
  inventory.$reset();
});
</script>

<template>
  <div class="relative w-full px-10 lg:px-1/8 lg:py-16">
    <div class="fixed inset-0 -z-10">
      <div class="bg-darkRadialGradient absolute inset-0 opacity-95"></div>
      <div class="bg-black/95 blur-sm absolute inset-0"></div>
    </div>
    <div :style="{ padding: `2rem ${gapSize}px 7rem` }" class="flex w-full mx-auto justify-between items-center gap-7">
      <div>
        <div class="flex gap-24 items-center uppercase">
          <div class="flex flex-col">
            <h3 class="font-bold text-xl text-white">Your vitals</h3>
            <span class="font-semibold text-sm text-deepGray">health & energy</span>
          </div>
          <div class="flex gap-16">
            <div class="flex gap-6 items-center">
              <div
                class="flex justify-center items-center border border-solid border-white/10 p-3">
                <Icon name="health" class="fill-white" :size="1.5" />
              </div>
              <div class="">
                <p class="text-sm text-white mb-1">
                  {{ 100 }} <span class="text-deepGray">/ {{ 100 }}</span>
                </p>
                <div class="w-24 h-1 bg-white/10 relative">
                  <div
                    class="absolute top-0 bottom-0 left-0 bg-limeZest" :style="{ width: `${100}%` }"></div>
                </div>
              </div>
            </div>
            <div class="flex gap-6 items-center">
              <div
                class="flex justify-center items-center border border-solid border-white/10 p-3">
                <Icon name="stamina" class="fill-white" :size="1.5" />
              </div>
              <div class="">
                <p class="text-sm text-white mb-1">
                  {{ 60 }} <span class="text-deepGray">/ {{ 200 }}</span>
                </p>
                <div class="w-24 h-1 bg-white/10 relative">
                  <div
                    class="absolute top-0 bottom-0 left-0 bg-aquaBlue" :style="{ width: `${30}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-7 items-center">
        <button class="uppercase text-sm font-bold text-white">close</button>
        <button
          class="uppercase text-sm font-bold text-white py-3 px-2.5 border border-solid border-white/10">
          esc
        </button>
      </div>
    </div>
    <div ref="containerRef" class="flex justify-around">
      <div>
        <h2 class="uppercase text-white text-2xl font-bold">character</h2>
        <div class="uppercase text-base text-deepGray">equipment</div>
        <div class="uppercase inline-grid grid-cols-3 gap-2.5 place-content-center mt-5">
          <EquipmentSlot name="headwear" />
          <EquipmentSlot name="mask" />
          <EquipmentSlot name="glasses" />
          <EquipmentSlot name="backpack" />
          <EquipmentSlot name="earrings" />
          <EquipmentSlot name="accessory" />
          <EquipmentSlot name="top" />
          <EquipmentSlot name="armor" />
          <EquipmentSlot name="gloves" />
          <EquipmentSlot name="lefthand" />
          <EquipmentSlot name="pants" />
          <EquipmentSlot name="righthand" />
          <EquipmentSlot name="shoes" class="col-start-2" />
        </div>
      </div>
      <div>
        <h2 class="uppercase text-white text-2xl font-bold">inventory</h2>
        <div class="uppercase text-base text-deepGray">items</div>
        <div class="inline-grid grid-cols-6 grid-rows-5 gap-2.5 mt-5">
          <InventorySlot v-for="(_, slot) in 24"
            :source="{ type: ItemSourceType.PlayerInventory, inventorySlot: slot }" />
        </div>
      </div>
      <div class="-mb-52">
        <h2 class="uppercase text-white text-2xl font-bold">global</h2>
        <div class="uppercase text-base text-deepGray">items on the floor or around you</div>
        <div class="inline-grid grid-cols-4 gap-2.5 mt-5">
          <div v-for="(_, slot) in 24"
            class="flex flex-col items-start fbasis-21 h-21 w-21 bg-silverCloud/[0.01] border border-solid border-white/[0.03] p-2 relative">
          </div>
        </div>
      </div>
    </div>
    <div :style="{ padding: `2rem ${gapSize}px` }" class="flex w-full justify-between">
      <div :style="{ width: `${widths[0]}px` }">
        <div
          class="h-0.5 w-full bg-white/10 mb-5 relative after:absolute after:content-[''] after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-3 after:h-3 after:bg-[#01010d] after:rotate-45 after:border after:border-solid after:border-white/30 after:outline after:outline-solid after:outline-[10px] after:outline-[#01010d]">
        </div>
        <h2 class="uppercase text-white text-2xl font-bold">extras</h2>
        <div class="uppercase text-base text-deepGray">other equipment</div>
        <div class="inline-grid grid-cols-3 gap-2.5 place-content-center mt-5 mb-8">
          <EquipmentSlot name="tool" />
          <EquipmentSlot name="phone" />
        </div>
      </div>
      <div :style="{ width: `${widths[1]}px` }" class="pt-5.5">
        <h2 class="uppercase text-white text-2xl font-bold">backpack</h2>
        <div class="uppercase text-base text-deepGray">quick access</div>
        <div class="mt-2.5 flex gap-2.5">
          <EquipmentSlot name="weapon" />
          <EquipmentSlot name="ammo" class="-ml-2.5 mr-2.5" />
          <EquipmentSlot name="quick1" />
          <EquipmentSlot name="quick2" />
          <EquipmentSlot name="quick3" />
          <EquipmentSlot name="quick4" />
        </div>
      </div>
      <div :style="{ width: `${widths[2]}px` }"></div>
    </div>
  </div>

  <!-- <TradeWindow class="absolute" :style="{ transform: `translate(35vw, 30vh)` }" /> -->
  <!-- <Shop class="absolute" :style="{ transform: `translate(30vw, 30vh)` }" /> -->
  <!-- <Storage class="absolute" :style="{ transform: `translate(30vw, 30vh)` }" /> -->
  <!-- <PlayerEquipment class="absolute" :style="{ transform: `translate(20vw, 30vh)` }" />
  <PlayerInventory class="absolute" :style="{ transform: `translate(62vw, 30vh)` }" /> -->

  <ContextMenu v-if="inventory.currentInteraction.type === InteractionType.ContextMenu"
    v-bind="inventory.currentInteraction.state" />
  <DropItemWarning v-if="inventory.currentInteraction.type === InteractionType.Dropping"
    v-bind="inventory.currentInteraction.state" />
  <ItemInfo v-if="inventory.currentInteraction.type === InteractionType.Hovering"
    :key="JSON.stringify(inventory.currentInteraction.state.item.source)" v-bind="inventory.currentInteraction.state" />
  <ItemPreview v-if="inventory.previewingItem" :key="JSON.stringify(inventory.previewingItem.source)"
    v-bind="inventory.previewingItem" />
  <!-- <Confirmation v-if="shop.interaction && shop.action" /> -->
</template>
