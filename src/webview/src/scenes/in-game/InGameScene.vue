<script setup lang="ts">
import { useChatStore } from "@/store/chat.store";
import { Events } from "@shared/constants/events";
import { usePlayerStore } from "@shared/store/player.store";
import { computed, effect, reactive, toRaw } from "vue";
import JsonViewer from "vue-json-viewer";
import ChatBox from "./chat-box/ChatBox.vue";
import Inventory from "./inventory/Inventory.vue";

const { setFocus } = useChatStore();
const playerStore = usePlayerStore();

const jsonData = computed(() => ({
  netOwnerOf: [...playerStore.sync.npc.netOwnerOf],
  streamedIn: playerStore.sync.npc.streamedIn,
}));

effect(() => {
  console.log(playerStore.sync.npc.netOwnerOf instanceof Set);
});

const visibleElements = reactive(
  new Set(globalThis.altMock ? ["inventory"] : [])
);

alt.on(Events.Webview.TOGGLE_ELEMENT, (element: string, visible) => {
  if (visible === null) {
    visible = !visibleElements.has(element);
  }
  if (visible) {
    visibleElements.add(element);
  } else {
    visibleElements.delete(element);
  }
  switch (element) {
    case "chat":
      setFocus(visible);
      break;
  }
});
</script>

<template>
  <ChatBox />
  <Inventory v-if="visibleElements.has('inventory')" />

  <JsonViewer
    v-if="visibleElements.has('json')"
    :value="jsonData"
    :expand-depth="5"
    boxed
  />
</template>
