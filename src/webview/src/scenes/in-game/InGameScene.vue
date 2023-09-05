<script setup lang="ts">
import { useAlt } from "@/composables/use-alt";
import { WebviewEvents } from "@shared/events/webview";
import { reactive } from "vue";
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

const { on } = useAlt();

const visibleElements = reactive(new Set(globalThis.altMock ? ["target-action"] : []));

on(WebviewEvents.FromClient.TOGGLE_ELEMENT, (element: string, visible) => {
  if (visible === null) {
    visible = !visibleElements.has(element);
  }
  if (visible) {
    visibleElements.add(element);
  } else {
    visibleElements.delete(element);
  }
});
</script>

<template>
  <Screen>
    <ChatBox v-if="visibleElements.has('chat')" />
    <ActionMenu v-if="visibleElements.has('action-menu')" />
    <template v-else>
      <Inventory v-if="visibleElements.has('inventory')" />
      <QuestMenu v-if="visibleElements.has('quest-menu')" />
      <SkillMenu v-if="visibleElements.has('skill-menu')" />
      <TargetAction v-if="visibleElements.has('target-action')" />
      <Conversation />
      <AreaIndicators />
      <WeaponHud />
    </template>
    <Notifications />
  </Screen>
</template>
