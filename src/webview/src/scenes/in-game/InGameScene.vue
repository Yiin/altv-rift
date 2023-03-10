<script setup lang="ts">
import { useAlt } from "@/composables/use-alt";
import { useChatStore } from "@/store/chat.store";
import { Events } from "@shared/constants/events";
import { usePlayerStore } from "@shared/store/player.store";
import { computed, reactive } from "vue";
import JsonViewer from "vue-json-viewer";
import ChatBox from "./chat-box/ChatBox.vue";
import Inventory from "./inventory/Inventory.vue";

const { setFocus } = useChatStore();
const playerStore = usePlayerStore();

const jsonData = computed(() => ({
  netOwnerOf: [...playerStore.sync.npc.netOwnerOf],
  streamedIn: playerStore.sync.npc.streamedIn,
}));

const visibleElements = reactive(
  new Set(globalThis.altMock ? ["inventory"] : [])
);

const { on } = useAlt();

on(Events.Webview.TOGGLE_ELEMENT, (element: string, visible) => {
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

  <JsonViewer
    v-if="visibleElements.has('json')"
    :value="jsonData"
    :expand-depth="5"
    boxed
  />
</template>
