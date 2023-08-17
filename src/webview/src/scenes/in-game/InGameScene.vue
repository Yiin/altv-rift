<script setup lang="ts">
import { useAlt } from "@/composables/use-alt";
import { WebviewEvents } from "@shared/events/webview";
import { reactive } from "vue";
import ChatBox from "./chat-box/ChatBox.vue";
import Inventory from "./inventory/Inventory.vue";
import Conversation from "./conversation/Conversation.vue";
import QuestMenu from "./quest-menu/QuestMenu.vue";
import SkillMenu from "./skill-menu/SkillMenu.vue";
import Notifications from "./notifications/Notifications.vue";

const { on } = useAlt();

const visibleElements = reactive(
  new Set(globalThis.altMock ? ["quest-menu"] : [])
);

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
  <ChatBox v-if="visibleElements.has('chat')" />
  <Inventory v-if="visibleElements.has('inventory')" />
  <QuestMenu v-if="visibleElements.has('quest-menu')" />
  <SkillMenu v-if="visibleElements.has('skill-menu')" />
  <Conversation />
  <Notifications />
</template>
