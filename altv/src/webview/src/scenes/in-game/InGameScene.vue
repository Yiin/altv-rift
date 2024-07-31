<script setup lang="ts">
import { computed, watch } from "vue";
import { UIElement } from "@shared/enums/ui";
import { WindowType } from "@shared/store/client.store";
import { StorageType } from "@shared/store/game-state.store";
import Screen from "@/components/Screen.vue";
import { useClient } from "@/store/synced/client.store";
import { isCharacterStoreAvailable } from "@/store/synced/character.store";
import { useGameState } from "@/store/synced/game-state.store";
import ChatBox from "./chat-box/ChatBox.vue";
import Inventory from "./inventory/Inventory.vue";
import GenericShop from "./shop/GenericShop.vue";
import LootBox from "./loot-box/LootBox.vue";
import Conversation from "./conversation/Conversation.vue";
import QuestMenu from "./quest-menu/QuestMenu.vue";
import SkillMenu from "./skill-menu/SkillMenu.vue";
import Notifications from "./notifications/Notifications.vue";
import AreaIndicators from "./area-indicators/AreaIndicators.vue";
import ActionMenu from "./action-menu/ActionMenu.vue";
import TargetAction from "./target-action/TargetAction.vue";
import FishingGame from "./fishing-game/FishingGame.vue";
import Workbench from "./workbench/Workbench.vue";
import VehicleShop from "./vehicle-shop/VehicleShop.vue";
import QuickAccess from "./quick-access/QuickAccess.vue";
import Hud from "./hud/Hud.vue";
import Admin from "./admin/Admin.vue";
import Builder from "./builder/Builder.vue";

const client = useClient();
const gameState = useGameState();

const windowType = computed(() => client.ui.window?.type);
const storageType = computed(() => gameState.openedStorage?.type);
const isShopOpen = computed(
  () => windowType.value === WindowType.SHOP && storageType.value === StorageType.Shop,
);
const isLootBoxOpen = computed(
  () =>
    windowType.value === WindowType.LOOT_BOX &&
    (storageType.value === StorageType.LootBox || storageType.value === StorageType.AirDrop),
);
const isVehicleShopOpen = computed(() => windowType.value === WindowType.VEHICLE_SHOP);
const isWorkbenchOpen = computed(() => windowType.value === WindowType.WORKBENCH);
const isAdminOpen = computed(() => windowType.value === WindowType.ADMIN);
const isBuilderOpen = computed(() => windowType.value === WindowType.BUILDER);

watch(
  () => !!gameState.openedStorage,
  (isOpen) => {
    if (!isOpen) {
      if ([WindowType.LOOT_BOX, WindowType.SHOP].includes(windowType.value)) {
        client.closeWindow();
      }
    }
  },
);
</script>

<template>
  <Screen v-if="isCharacterStoreAvailable()">
    <template v-if="client.ui.window">
      <Inventory />
      <!-- <Inventory v-if="[WindowType.PLAYER_INVENTORY, WindowType.STORAGE].includes(windowType)" />
      <GenericShop v-else-if="isShopOpen" />
      <LootBox v-else-if="isLootBoxOpen" />
      <VehicleShop v-else-if="isVehicleShopOpen" />
      <Workbench v-else-if="isWorkbenchOpen" />
      <Admin v-else-if="isAdminOpen" />
      <Builder v-else-if="isBuilderOpen" /> -->
    </template>
    <ActionMenu v-else-if="client.ui.elements.has(UIElement.ACTION_MENU)" />
    <template v-else>
      <ChatBox v-if="client.ui.elements.has(UIElement.CHAT)" />
      <QuestMenu v-if="client.ui.elements.has(UIElement.QUEST_MENU)" />
      <SkillMenu v-if="client.ui.elements.has(UIElement.SKILL_MENU)" />
      <TargetAction v-if="client.ui.elements.has(UIElement.TARGET_ACTION)" />
      <Conversation />
      <AreaIndicators />
      <Hud />
      <FishingGame />
      <QuickAccess />
    </template>
    <Notifications />
  </Screen>
  <Screen v-else>
    <h1 class="font-extrabold text-white">Character store is not initialized</h1>
  </Screen>
</template>
