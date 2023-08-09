<script setup lang="ts">
import Window from "@/components/Window.vue";
import { useClient } from "@/store/client.store";
import { usePlayerStore } from "@shared/store/player.store";
import { computed } from "vue";

const player = usePlayerStore();
const client = useClient();
const quests = computed(() => client.activeQuests);
const questFacts = computed(() => player.character?.questFacts ?? []);
</script>

<template>
  <Window :minw="300">
    <v-theme-provider theme="dark">
      <v-sheet class="w-full h-full bg-gray-800/95 px-4 py-2">
        <div class="uppercase text-sm tracking-wider text-white">Quests</div>
        <div v-for="quest of quests">
          <div class="font-bold">{{ quest.name }}</div>
          <div class="text-sm">{{ quest.summary }}</div>
          <div>
            <div
              v-for="task in quest.tasks.filter(
                (task) =>
                  !task.visibleFact ||
                  questFacts.includes(task.visibleFact) ||
                  questFacts.includes(task.completedFact)
              )"
            >
              <div class="font-semibold">{{ task.title }}</div>
              <div class="text-sm">{{ task.summary }}</div>
              <div>
                {{
                  questFacts.includes(task.completedFact)
                    ? "Done"
                    : "In progress"
                }}
              </div>
            </div>
          </div>
        </div>
      </v-sheet>
    </v-theme-provider>
  </Window>
</template>
