<script setup lang="ts">
import { computed, ref } from "vue";
import Window from "@/components/Window.vue";
import { useClient } from "@/store/synced/client.store";
import Quest from "./Quest.vue";
import { useUser } from "@/store/synced/user.store";

const client = useClient();
const user = useUser();

const defaultPosition = computed(() => {
  return (
    user.interface?.questMenu?.screen ?? {
      x: window.innerWidth / 4,
      y: window.innerHeight / 3,
      w: 400,
    }
  );
});

const filter = ref<"incomplete" | "complete" | "all">("incomplete");

const questFacts = computed(() => client.questFacts);
const quests = computed(() => {
  switch (filter.value) {
    case "incomplete":
      return client.activeQuests.filter((quest) =>
        quest.tasks.some((task) => !questFacts.value.includes(task.completedFact))
      );
    case "complete":
      return client.activeQuests.filter((quest) =>
        quest.tasks.every((task) => questFacts.value.includes(task.completedFact))
      );
    case "all":
      return client.activeQuests;
  }
});

const filters = [
  {
    type: "incomplete",
    icon: "mdi-format-list-checks",
    label: "In progress",
  },
  {
    type: "complete",
    icon: "mdi-checkbox-marked-outline",
    label: "Completed",
  },
  {
    type: "all",
    icon: "mdi-view-sequential",
    label: "All",
  },
] as const;
</script>

<template>
  <Window
    name="questMenu"
    :minw="defaultPosition.w"
    :x="defaultPosition.x"
    :y="defaultPosition.y"
    :is-active="false"
    :sticks="[]"
  >
    <div class="divide-y rounded-xl border divide-gray-800 border-gray-800 bg-gray-900">
      <h3 class="text-lg font-bold text-white sm:text-xl m-4">Quests</h3>

      <div class="flex justify-evenly rounded-lg border p-1 border-gray-800 bg-gray-900">
        <button
          v-for="{ type, icon, label } in filters"
          @click="filter = type"
          class="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm focus:relative text-gray-400 hover:text-gray-200"
          :class="[filter === type ? 'bg-gray-800' : 'focus-relative hover:text-gray-200']"
        >
          <v-icon :icon="icon" />
          {{ label }}
        </button>
      </div>

      <Quest v-for="quest of quests" :key="quest.name" :quest="quest" />
    </div>
  </Window>
</template>
