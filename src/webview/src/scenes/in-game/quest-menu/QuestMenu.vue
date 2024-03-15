<script setup lang="ts">
import { computed, ref } from "vue";
import Window from "@/components/Window.vue";
import { useClient } from "@/store/synced/client.store";
import { useUser } from "@/store/synced/user.store";
import Quest from "./Quest.vue";

const client = useClient();
const user = useUser();

const defaultPosition = computed(() => {
  return (
    user?.interface?.questMenu?.screen ?? {
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
        quest.tasks.some((task) => !questFacts.value.includes(task.completedFact)),
      );
    case "complete":
      return client.activeQuests.filter((quest) =>
        quest.tasks.every((task) => questFacts.value.includes(task.completedFact)),
      );
    default:
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
    <div class="divide-y divide-neutral-800 rounded-xl border border-neutral-800 bg-neutral-900">
      <h3 class="m-4 text-lg font-bold text-white sm:text-xl">Quests</h3>

      <div class="flex justify-evenly rounded-lg border border-neutral-800 bg-neutral-900 p-1">
        <button
          v-for="{ type, icon, label } in filters"
          :key="type"
          @click="filter = type"
          class="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 focus:relative"
          :class="[filter === type ? 'bg-neutral-800' : 'focus-relative hover:text-neutral-200']"
        >
          <v-icon :icon="icon" />
          {{ label }}
        </button>
      </div>

      <Quest
        v-for="quest of quests.reverse()"
        :key="quest.name"
        :quest="quest"
      />
    </div>
  </Window>
</template>
