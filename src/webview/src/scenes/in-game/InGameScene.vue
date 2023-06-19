<script setup lang="ts">
import { useAlt } from "@/composables/use-alt";
import { WebviewEvents } from "@shared/events/webview";
import { usePlayerStore } from "@shared/store/player.store";
import { computed, reactive } from "vue";
import JsonViewer from "vue-json-viewer";
import ChatBox from "./chat-box/ChatBox.vue";
import Inventory from "./inventory/Inventory.vue";
import WorldUIElements from "./world-ui-elements/WorldUIElements.vue";

const playerStore = usePlayerStore();

const jsonData = computed(() => ({
  netOwnerOf: [...playerStore.sync.npc.netOwnerOf],
  streamedIn: playerStore.sync.npc.streamedIn,
}));

const visibleElements = reactive(
  new Set(globalThis.altMock ? ["inventory"] : [])
);

const { on } = useAlt();

on(WebviewEvents.FromClient.TOGGLE_ELEMENT, (element: string, visible) => {
  if (visible === null) {
    visible = !visibleElements.has(element);
  }
  console.log("toggle element", element, visible);
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
  <WorldUIElements />

  <JsonViewer
    v-if="visibleElements.has('json')"
    :value="jsonData"
    :expand-depth="5"
    boxed
  />
</template>
