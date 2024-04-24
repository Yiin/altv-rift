<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import { ItemSourceOrigin, EquipmentSlot as EquipmentSlotEnum } from "@shared/interfaces";
import { InteractionType, useInventory } from "@/store/inventory.store";
import { useEventListener } from "@/composables/use-event-listener";
import { useGapSize } from "@/composables/use-gap-size";
import { useGameState } from "@/store/synced/game-state.store";
import Icon from "../../../components/Icon/Icon.vue";
import DarkBackground from "../../../components/DarkBackground.vue";
import BackButtons from "../../../components/buttons/BackButtons.vue";
import ContextMenu from "./ContextMenu.vue";
import ItemInfo from "./ItemInfo.vue";
import EquipmentSlot from "./EquipmentSlot.vue";
import InventorySlot from "./InventorySlot.vue";
import StorageItems from "./storage/Storage.vue";
import GroundItems from "./ground/Ground.vue";
import AmountTransfer from "./AmountTransfer.vue";
import Ammunition from "./Ammunition.vue";
import ItemPreview from "./item-preview/ItemPreview.vue";

const inventory = useInventory();
const gameState = useGameState();

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
    <DarkBackground />
    <div
      :style="{ padding: `2rem ${gapSize}px 7rem` }"
      class="mx-auto flex w-full items-center justify-between gap-7"
    >
      <div>
        <div class="flex items-center gap-24 uppercase">
          <div class="flex flex-col">
            <h3 class="text-xl font-bold text-white">Your vitals</h3>
            <span class="text-sm font-semibold text-deepGray">health & energy</span>
          </div>
          <div class="flex gap-16">
            <div class="flex items-center gap-6">
              <div class="flex items-center justify-center border border-solid border-white/10 p-3">
                <Icon
                  name="health"
                  class="fill-white"
                  :size="1.5"
                />
              </div>
              <div>
                <p class="mb-1 text-sm text-white">
                  {{ 100 }}
                  <span class="text-deepGray">/ {{ 100 }}</span>
                </p>
                <div class="relative h-1 w-24 bg-white/10">
                  <div
                    class="absolute bottom-0 left-0 top-0 bg-limeZest"
                    :style="{ width: `${100}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="flex items-center justify-center border border-solid border-white/10 p-3">
                <Icon
                  name="stamina"
                  class="fill-white"
                  :size="1.5"
                />
              </div>
              <div>
                <p class="mb-1 text-sm text-white">
                  {{ 60 }}
                  <span class="text-deepGray">/ {{ 200 }}</span>
                </p>
                <div class="relative h-1 w-24 bg-white/10">
                  <div
                    class="absolute bottom-0 left-0 top-0 bg-aquaBlue"
                    :style="{ width: `${30}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BackButtons />
    </div>
    <div
      ref="containerRef"
      class="flex justify-around"
    >
      <div>
        <h2 class="text-2xl font-bold uppercase text-white">character</h2>
        <div class="text-base uppercase text-deepGray">equipment</div>
        <div class="mt-5 inline-grid grid-cols-3 place-content-center gap-2.5 uppercase">
          <EquipmentSlot :name="EquipmentSlotEnum.Headwear" />
          <EquipmentSlot :name="EquipmentSlotEnum.Mask" />
          <EquipmentSlot :name="EquipmentSlotEnum.Glasses" />
          <EquipmentSlot :name="EquipmentSlotEnum.Backpack" />
          <EquipmentSlot :name="EquipmentSlotEnum.Earrings" />
          <EquipmentSlot :name="EquipmentSlotEnum.Accessory" />
          <EquipmentSlot :name="EquipmentSlotEnum.Top" />
          <EquipmentSlot :name="EquipmentSlotEnum.Armor" />
          <EquipmentSlot :name="EquipmentSlotEnum.Gloves" />
          <EquipmentSlot :name="EquipmentSlotEnum.LeftHand" />
          <EquipmentSlot :name="EquipmentSlotEnum.Pants" />
          <EquipmentSlot :name="EquipmentSlotEnum.RightHand" />
          <EquipmentSlot
            :name="EquipmentSlotEnum.Shoes"
            class="col-start-2"
          />
        </div>
      </div>
      <div>
        <div class="relative flex justify-between">
          <div>
            <h2 class="text-2xl font-bold uppercase text-white">inventory</h2>
            <div class="text-base uppercase text-deepGray">items</div>
          </div>
          <div
            class="inline-block"
            v-click-outside="inventory.closeAmmunitionPanel"
          >
            <div
              @click="inventory.openAmmunitionPanel()"
              class="flex h-[45px] w-[139px] cursor-pointer items-center justify-center border border-white border-opacity-5 bg-zinc-600 bg-opacity-0 hover:bg-opacity-5"
            >
              <div class="text-sm font-bold uppercase text-white">ammunition</div>
            </div>
            <Ammunition
              v-if="inventory.currentInteraction?.type === InteractionType.AmmunitionPanel"
              class="absolute right-0 top-14.5"
            />
          </div>
        </div>
        <div class="mt-5 inline-grid grid-cols-6 grid-rows-5 gap-2.5">
          <InventorySlot
            v-for="(_, slot) in inventory.size"
            :key="slot"
            :source="{
              origin: ItemSourceOrigin.PlayerInventory,
              originId: inventory.playerId,
              inventorySlot: slot,
            }"
          />
        </div>
      </div>
      <div class="-mb-52">
        <StorageItems v-if="gameState.openedStorage" />
        <GroundItems v-else />
      </div>
    </div>
    <div
      :style="{ padding: `2rem ${gapSize}px` }"
      class="flex w-full justify-between"
    >
      <div :style="{ width: `${widths[0]}px` }">
        <div
          class="after:outline-solid relative mb-5 h-0.5 w-full bg-white/10 after:absolute after:left-1/2 after:top-1/2 after:h-3 after:w-3 after:-translate-x-1/2 after:-translate-y-1/2 after:rotate-45 after:border after:border-solid after:border-white/30 after:bg-[#01010d] after:outline after:outline-[10px] after:outline-[#01010d] after:content-['']"
        ></div>
        <h2 class="text-2xl font-bold uppercase text-white">extras</h2>
        <div class="text-base uppercase text-deepGray">other equipment</div>
        <div class="mb-8 mt-5 inline-grid grid-cols-3 place-content-center gap-2.5">
          <EquipmentSlot :name="EquipmentSlotEnum.Tool" />
          <EquipmentSlot :name="EquipmentSlotEnum.Phone" />
        </div>
      </div>
      <div
        :style="{ width: `${widths[1]}px` }"
        class="pt-5.5"
      >
        <h2 class="text-2xl font-bold uppercase text-white">backpack</h2>
        <div class="text-base uppercase text-deepGray">quick access</div>
        <div class="mt-2.5 flex gap-2.5">
          <EquipmentSlot
            :name="EquipmentSlotEnum.Weapon"
            class="w-44.5"
          />
          <EquipmentSlot :name="EquipmentSlotEnum.QuickSlot1" />
          <EquipmentSlot :name="EquipmentSlotEnum.QuickSlot2" />
          <EquipmentSlot :name="EquipmentSlotEnum.QuickSlot3" />
          <EquipmentSlot :name="EquipmentSlotEnum.QuickSlot4" />
        </div>
      </div>
      <div :style="{ width: `${widths[2]}px` }"></div>
    </div>
  </div>

  <ContextMenu
    v-if="inventory.currentInteraction.type === InteractionType.ContextMenu"
    v-bind="inventory.currentInteraction.state"
  />
  <ItemInfo
    v-if="inventory.currentInteraction.type === InteractionType.Hovering"
    :key="JSON.stringify(inventory.currentInteraction.state.item.source)"
    v-bind="inventory.currentInteraction.state"
  />
  <ItemPreview
    v-if="inventory.previewingItem"
    :key="JSON.stringify(inventory.previewingItem.source)"
    v-bind="inventory.previewingItem"
  />
  <AmountTransfer
    v-if="inventory.currentInteraction.type === InteractionType.TransferingAmount"
    v-bind="inventory.currentInteraction.state"
  />
  <!-- <Confirmation v-if="inventory.transfer" /> -->
</template>
