<script setup lang="ts">
import { useAlt } from "@/composables/use-alt";
import { WebviewEvents } from "@shared/events/webview";
import { computed, reactive, watchEffect } from "vue";
import Screen from "@/components/Screen.vue";
import ChatBox from "./chat-box/ChatBox.vue";
import Inventory from "./inventory/Inventory.vue";
import Conversation from "./conversation/Conversation.vue";
import QuestMenu from "./quest-menu/QuestMenu.vue";
import SkillMenu from "./skill-menu/SkillMenu.vue";
import WeaponHud from "./weapon-hud/WeaponHud.vue";
import Notifications from "./notifications/Notifications.vue";
import AreaIndicators from "./area-indicators/AreaIndicators.vue";
import ActionMenu from "./action-menu/ActionMenu.vue";
import TargetAction from "./target-action/TargetAction.vue";
import { useClient } from "@/store/synced/client.store";
import { UIElement } from "@shared/enums/ui";

const client = useClient();

watchEffect(() => {
  console.log([...client.ui.elements.values()].join(', '))
})
</script>

<template>
  <Screen>
    <ChatBox v-if="client.ui.elements.has(UIElement.CHAT)" />
    <template v-if="client.ui.window">
      <Inventory v-if="client.ui.window.type === 'playerInventory'" />
    </template>
    <ActionMenu v-else-if="client.ui.elements.has(UIElement.ACTION_MENU)" />
    <template v-else>
      <QuestMenu v-if="client.ui.elements.has(UIElement.QUEST_MENU)" />
      <SkillMenu v-if="client.ui.elements.has(UIElement.SKILL_MENU)" />
      <TargetAction v-if="client.ui.elements.has(UIElement.TARGET_ACTION)" />
      <Conversation />
      <AreaIndicators />
      <WeaponHud />
    </template>
    <Notifications />
  </Screen>
</template>
