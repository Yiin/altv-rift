<script setup lang="ts">
import { ref, watch } from "vue";
import JsonEditorVue from "json-editor-vue";
import { ServerCall } from "@shared/calls/server";
import { useCharacter } from "@/store/synced/character.store";
import { rpc } from "@/rpc";

const character = useCharacter();

const ignoreUpdate = ref(false);

const data = ref(JSON.parse(JSON.stringify(character.$state)));

watch(character, () => {
  ignoreUpdate.value = true;
  data.value = JSON.parse(JSON.stringify(character.$state));
});

watch(data, () => {
  if (ignoreUpdate.value) {
    ignoreUpdate.value = false;
    return;
  }
  rpc.callServer(ServerCall.FromWebview.ADMIN_ACTION, "character", data.value);
});
</script>

<template>
  <div class="overflow-auto">
    <JsonEditorVue
      v-model="data"
      class="max-h-screen-1/2"
    />
  </div>
</template>
