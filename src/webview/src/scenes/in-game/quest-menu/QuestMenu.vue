<script setup lang="ts">
import { computed } from "vue";
import Window from "@/components/Window.vue";
import { useClient } from "@/store/client.store";
import Quest from "./Quest.vue";

const client = useClient();
const quests = computed(() => client.activeQuests);
</script>

<template>
  <Window :minw="300" :is-active="false" :sticks="[]">
    <div class="divide-y rounded-xl border divide-gray-800 border-gray-800 bg-gray-900">

      <h3 class="text-lg font-bold text-white sm:text-xl m-4">
        Quests
      </h3>

      <Quest v-for="quest of quests" :key="quest.name" :quest="quest" />
    </div>
  </Window>
</template>
