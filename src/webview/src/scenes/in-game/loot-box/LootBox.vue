<script setup lang="ts">
import { format, differenceInMilliseconds } from "date-fns";
import { ref } from "vue";
import { type Item } from "@shared/modules/items";
import { ServerCall } from "@shared/calls/server";
import { StorageType } from "@shared/store/game-state.store";
import { rpc } from "@/rpc";
import { useClient } from "@/store/synced/client.store";
import BackButtons from "@/components/buttons/BackButtons.vue";
import DarkBackground from "../../../components/DarkBackground.vue";
import LootBoxSlot from "./LootBoxSlot.vue";
import LootBoxItemInfo from "./LootBoxItemInfo.vue";
import LootBoxEmblem from "./LootBoxEmblem.vue";
import { useLootBox } from "./loot-box";

const hoveredItem = ref<Item | null>(null);
const timeLeft = ref<string>("");

const client = useClient();
const lootBox = useLootBox();

setInterval(() => {
  if (lootBox.type !== StorageType.AirDrop) return;
  timeLeft.value = format(differenceInMilliseconds(lootBox.validUntil, Date.now()), "mm:ss");
}, 100);

function handleMouseEnter(item: Item) {
  hoveredItem.value = item;
}

function handleMouseLeave() {
  hoveredItem.value = null;
}

function takeAllItems() {
  rpc.callServer(ServerCall.FromWebview.TAKE_ALL_ITEMS, lootBox.source);
}
</script>

<template>
  <div class="relative w-full px-10 lg:px-1/8 lg:py-16">
    <DarkBackground />
    <div class="mx-auto flex w-full items-center justify-end">
      <BackButtons />
    </div>

    <div class="mt-16 flex h-full items-center justify-center text-white">
      <div class="mx-auto flex max-w-lg flex-col items-center">
        <!-- Header -->
        <div class="relative">
          <LootBoxEmblem class="text-main-500" />
        </div>
        <!-- Title -->
        <h1 class="mt-8 text-center text-5xl font-normal">
          You opened
          <b class="font-extrabold text-main-500">Military crate</b>
        </h1>
        <!-- <div class="mt-1.75 text-xl text-lavenderGray">Faster, someone call FBI.</div> -->
        <!-- Items -->
        <div class="my-11 grid grid-cols-5 gap-2.5">
          <template
            v-for="(_, index) in lootBox.inventory.size"
            :key="index"
          >
            <LootBoxSlot
              v-if="lootBox.inventory.items[index]"
              :source="{ ...lootBox.source, inventorySlot: lootBox.inventory.items[index].slot }"
              :item="lootBox.inventory.items[index].item"
              @mouseover="handleMouseEnter(lootBox.inventory.items[index].item)"
              @mouseleave="handleMouseLeave"
            />
            <LootBoxSlot v-else />
          </template>
        </div>
        <!-- Actions -->
        <div class="mt-2.5 grid w-full grid-cols-2 gap-2.5">
          <button
            @click="takeAllItems"
            class="flex items-center justify-center bg-main-500 py-4 text-base font-bold text-white transition hover:bg-main-600"
          >
            <span class="-mb-0.5">Take all loot</span>
          </button>
          <button
            @click="client.closeWindow"
            class="flex items-center justify-center border border-solid border-white/50 bg-transparent py-4 text-base font-bold text-white"
          >
            <span class="-mb-0.5">Close crate</span>
          </button>
        </div>
        <div class="mt-11 flex flex-col items-center justify-center">
          <p class="text-2xl font-medium text-white">Time remaining</p>
          <span class="text-4xl font-bold text-main-500">{{ timeLeft }}</span>
        </div>
      </div>
    </div>
    <LootBoxItemInfo
      v-if="hoveredItem"
      :item="hoveredItem"
      action-text="Click to take"
    />
  </div>
</template>
