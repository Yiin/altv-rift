<script setup lang="ts">
import { ClientFlags } from "@shared/store/client.store";
import { useClient } from "@/store/synced/client.store";
import FishingIcon from "./assets/fishing.svg";
import DiggingIcon from "./assets/digging.svg";

const client = useClient();
</script>

<template>
  <div class="absolute right-24 top-[30%]">
    <div
      v-if="client.flags.has(ClientFlags.CanFish)"
      class="flex flex-col items-center justify-center"
    >
      <FishingIcon class="h-16 w-16" />
      <div class="crisp-shadow -mt-2 tracking-wider text-white">Fishing area</div>
    </div>
    <div
      v-if="client.flags.has(ClientFlags.CanDig)"
      class="flex flex-col items-center justify-center"
    >
      <DiggingIcon class="h-16 w-16" />
      <div class="crisp-shadow -mt-2 tracking-wider text-white">Digging area</div>
    </div>
  </div>
</template>
