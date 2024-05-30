<script setup lang="ts">
import { useClient } from "@/store/synced/client.store";

const client = useClient();
</script>

<template>
  <div
    @click="client.closeWindow"
    class="flex cursor-pointer items-center gap-7"
  >
    <div class="text-sm font-bold uppercase text-white">close</div>
    <div
      class="border border-solid border-white/10 px-2.5 py-3 text-sm font-bold uppercase text-white"
    >
      esc
    </div>
  </div>
</template>
