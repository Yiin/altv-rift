<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import { ItemSourceOrigin, EquipmentSlot as EquipmentSlotEnum } from "@shared/interfaces";
import { StorageType } from "@shared/store/game-state.store";
import { useEventListener } from "@/composables/use-event-listener";
import { useGapSize } from "@/composables/use-gap-size";
import { useGameState } from "@/store/synced/game-state.store";
import { useCharacter } from "@/store/synced/character.store";
import {
  handleInventoryMouseDown,
  handleInventoryMouseMove,
  handleInventoryMouseUp,
  handleInventoryClick,
  resetInventoryState,
  closeAmmunitionPanel,
  openAmmunitionPanel,
  getCurrentInventoryInteraction,
  getInventorySize,
  getPreviewingItem,
  InventoryInteractionType,
} from "@/store/inventory";
import Icon from "@/components/Icon/Icon.vue";
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

const character = useCharacter();
const gameState = useGameState();

const containerRef = ref<HTMLDivElement>();
const { gapSize, widths } = useGapSize(containerRef);

const money = computed(() => {
  return new Intl.NumberFormat("lt-LT").format(character.money);
});

useEventListener("mousedown", handleInventoryMouseDown);
useEventListener("mousemove", handleInventoryMouseMove);
useEventListener("mouseup", handleInventoryMouseUp);
useEventListener("click", handleInventoryClick, true);

const currentInteraction = getCurrentInventoryInteraction();
const previewingItem = computed(() => getPreviewingItem());

onUnmounted(() => {
  resetInventoryState();
});
</script>

<template>
  <div class="relative w-full px-10">
    <DarkBackground :extra-dark="false" />
    <div
      :style="{ padding: `2rem ${gapSize}px 7rem` }"
      class="mx-auto flex w-full items-center justify-between gap-7"
    >
      <div>
        <div class="flex items-center gap-24 uppercase">
          <div class="flex flex-col">
            <h3 class="flex items-center gap-2.25 text-xl font-bold text-white">
              {{ money }}
              <Icon
                name="money"
                class="text-white"
                :size="1.1875"
              />
            </h3>
            <span class="text-sm font-semibold text-deepGray">money</span>
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
            v-click-outside="closeAmmunitionPanel"
          >
            <div
              @click="openAmmunitionPanel()"
              class="flex h-11.25 w-34.75 cursor-pointer items-center justify-center border border-white border-opacity-5 bg-zinc-600 bg-opacity-0 hover:bg-opacity-5"
            >
              <div class="text-sm font-bold uppercase text-white">ammunition</div>
            </div>
            <Ammunition
              v-if="currentInteraction?.type === InventoryInteractionType.AmmunitionPanel"
              class="absolute right-0 top-14.5"
            />
          </div>
        </div>
        <div class="mt-5 inline-grid grid-cols-6 grid-rows-5 gap-2.5">
          <InventorySlot
            v-for="(_, slot) in getInventorySize()"
            :key="slot"
            :source="{
              origin: ItemSourceOrigin.PlayerInventory,
              originId: character.id,
              inventorySlot: slot,
            }"
          />
        </div>
      </div>
      <div class="-mb-52">
        <StorageItems
          v-if="gameState.openedStorage?.type === StorageType.Storage"
          v-bind="gameState.openedStorage"
        />
        <GroundItems v-else />
      </div>
    </div>
    <div class="flex w-full justify-around py-8">
      <div :style="{ width: `${widths[0]}px` }">
        <div class="relative mb-5 flex items-center justify-center gap-2.75">
          <div class="h-px w-full border border-white opacity-10"></div>
          <div
            class="h-3 w-3 flex-shrink-0 origin-center -rotate-45 border border-white opacity-30"
          ></div>
          <div class="h-px w-full border border-white opacity-10"></div>
        </div>
        <h2 class="text-2xl font-bold uppercase text-white">extras</h2>
        <div class="text-base uppercase text-deepGray">other equipment</div>
        <div class="mb-8 mt-5 inline-grid grid-cols-3 place-content-center gap-2.5">
          <EquipmentSlot :name="EquipmentSlotEnum.Tool" />
          <EquipmentSlot :name="EquipmentSlotEnum.Phone" />
        </div>
      </div>
      <div
        :style="{ width: `${widths[1]}px` }"
        class="pt-8"
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
    v-if="currentInteraction.type === InventoryInteractionType.ContextMenu"
    v-bind="currentInteraction.state"
  />
  <ItemInfo
    v-if="currentInteraction.type === InventoryInteractionType.Hovering"
    :key="JSON.stringify(currentInteraction.state.item.source)"
    v-bind="currentInteraction.state"
  />
  <ItemPreview
    v-if="previewingItem"
    :key="JSON.stringify(previewingItem.source)"
    v-bind="previewingItem"
  />
  <AmountTransfer
    v-if="currentInteraction.type === InventoryInteractionType.TransferingAmount"
    v-bind="currentInteraction.state"
  />
</template>
