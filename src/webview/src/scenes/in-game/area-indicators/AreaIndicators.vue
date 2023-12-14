<script setup lang="ts">
import { useClient } from "@/store/synced/client.store";
import { ClientFlags } from "@shared/store/client.store";
import FishingIcon from "@/components/icons/FishingIcon.vue";
import DiggingIcon from "@/components/icons/DiggingIcon.vue";

const client = useClient();
</script>

<template>
  <div class="absolute right-24 top-[30%]">
    <div v-if="client.flags.has(ClientFlags.CanFish)" class="flex flex-col justify-center items-center">
      <FishingIcon class="w-16 h-16" />
      <div class="crisp-shadow text-white tracking-wider -mt-2">Fishing area</div>
    </div>
    <div v-if="client.flags.has(ClientFlags.CanDig)" class="flex flex-col justify-center items-center">
      <DiggingIcon class="w-16 h-16" />
      <div class="crisp-shadow text-white tracking-wider -mt-2">Digging area</div>
    </div>
  </div>
</template>
