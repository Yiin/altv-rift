<script setup lang="ts">
import { UIElement } from "@shared/enums/ui";
import { WindowType } from "@shared/store/client.store";
import Screen from "@/components/Screen.vue";
import { useClient } from "@/store/synced/client.store";
import ChatBox from "./chat-box/ChatBox.vue";
import Inventory from "./inventory/Inventory.vue";
import LootBox from "./loot-box/LootBox.vue";
import Conversation from "./conversation/Conversation.vue";
import QuestMenu from "./quest-menu/QuestMenu.vue";
import SkillMenu from "./skill-menu/SkillMenu.vue";
import WeaponHud from "./weapon-hud/WeaponHud.vue";
import Notifications from "./notifications/Notifications.vue";
import AreaIndicators from "./area-indicators/AreaIndicators.vue";
import ActionMenu from "./action-menu/ActionMenu.vue";
import TargetAction from "./target-action/TargetAction.vue";
import FishingGame from "./fishing-game/FishingGame.vue";
import Workbench from "./workbench/Workbench.vue";
import VehicleShop from "./vehicle-shop/VehicleShop.vue";
import QuickAccess from "./quick-access/QuickAccess.vue";

const client = useClient();
</script>

<template>
  <Screen>
    <template v-if="client.ui.window">
      <Inventory
        v-if="
          [WindowType.PLAYER_INVENTORY, WindowType.SHOP, WindowType.STORAGE].includes(
            client.ui.window.type,
          )
        "
      />
      <LootBox v-if="client.ui.window.type === WindowType.LOOT_BOX" />
      <VehicleShop v-if="client.ui.window.type === WindowType.VEHICLE_SHOP" />
      <Workbench v-if="client.ui.window.type === WindowType.WORKBENCH" />
    </template>
    <ActionMenu v-else-if="client.ui.elements.has(UIElement.ACTION_MENU)" />
    <template v-else>
      <ChatBox v-if="client.ui.elements.has(UIElement.CHAT)" />
      <QuestMenu v-if="client.ui.elements.has(UIElement.QUEST_MENU)" />
      <SkillMenu v-if="client.ui.elements.has(UIElement.SKILL_MENU)" />
      <TargetAction v-if="client.ui.elements.has(UIElement.TARGET_ACTION)" />
      <Conversation />
      <AreaIndicators />
      <WeaponHud />
      <FishingGame />
      <QuickAccess />
    </template>
    <Notifications />
  </Screen>
</template>
