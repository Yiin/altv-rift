<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import Messages from "@/components/ChatBox/Messages.vue";
import MessageInput from "@/components/ChatBox/MessageInput.vue";
import CommandSuggestions from "@/components/ChatBox/CommandSuggestions.vue";
import { useChatStore } from "../../../store/chat.store";
import type { CommandSuggestion, Options } from "../../../interfaces";

// --------------------------------------------------------------
// Chat Store
// --------------------------------------------------------------

const { setFocus, commandSuggestions, setCommandSuggestions, setOptions } = useChatStore();

// --------------------------------------------------------------
// Functions
// --------------------------------------------------------------

// Focus --------------------------------------------------------

/**
 * Toggle focus on the chat box.
 * @param focus Whether the chat box is focused.
 */
function toggleFocus(focus: boolean) {
  setFocus(focus);
}

/**
 * Syncs the client settings with the server settings.
 * @param settings The chat window's settings.
 */
function syncSettings(settings: Options, _commandSuggestions: Array<CommandSuggestion>) {
  setOptions(settings);
  setCommandSuggestions([...commandSuggestions.value, ..._commandSuggestions]);
  window?.alt?.emitRaw("vchat:mounted");
}

/**
 * Updates the window's options.
 * @param options The new options.
 */
function updateOptions(options: Options) {
  setOptions(options);
}

// --------------------------------------------------------------
// Hooks
// --------------------------------------------------------------

// Mount --------------------------------------------------------

onMounted(() => {
  window?.alt?.on("vchat:focus", toggleFocus);
  window?.alt?.on("vchat:syncSettings", syncSettings);
  window?.alt?.on("vchat:updateOptions", updateOptions);
  window?.alt?.emitRaw("vchat:requestSettings");
});

// Unmount ------------------------------------------------------

onUnmounted(() => {
  window?.alt?.off("vchat:focus", toggleFocus);
  window?.alt?.off("vchat:syncSettings", syncSettings);
  window?.alt?.off("vchat:updateOptions", updateOptions);
});
</script>

<template>
  <div class="fixed left-[16px] top-[16px] w-[640px]">
    <Messages />
    <MessageInput />
    <CommandSuggestions />
  </div>
</template>
