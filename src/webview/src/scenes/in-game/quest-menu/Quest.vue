<script setup lang="ts">
import { computed } from "vue";
import { useClient } from "@/store/synced/client.store";
import { QuestInfo } from "@shared/store/client.store";
import QuestTask from "./QuestTask.vue";

const props = defineProps<{
  quest: QuestInfo;
}>();

const client = useClient();

const questFacts = computed(() => client.questFacts);
const isQuestCompleted = computed(() =>
  props.quest.tasks.every((task) => questFacts.value.includes(task.completedFact))
);

function toggleSingle(e: Event) {
  if (e.currentTarget instanceof HTMLDetailsElement && !e.currentTarget.open) {
    document.querySelectorAll('[class*="group/quest"]').forEach((node) => {
      if (node instanceof HTMLDetailsElement && node !== e.currentTarget && node.open) {
        node.open = false;
      }
    });
  }
}
</script>

<template>
  <details class="group/quest px-6 py-3 [&_summary::-webkit-details-marker]:hidden" @click="toggleSingle">
    <summary class="flex cursor-pointer items-center justify-between gap-1.5 text-white">
      <h2 class="text-lg font-medium">
        {{ quest.name }}
      </h2>

      <div class="flex items-center gap-6">
        <span class="inline-flex items-center justify-center rounded-full px-2.5 py-0.5" :class="[
          isQuestCompleted ? 'bg-green-700 text-green-100' : 'bg-orange-700 text-orange-100',
        ]">
          <v-icon v-if="isQuestCompleted" icon="mdi-check" class="-ms-1 me-1.5 h-4 w-4" />

          <p class="whitespace-nowrap text-sm">{{ isQuestCompleted ? "Done" : "In Progress" }}</p>
        </span>

        <span class="relative h-5 w-5 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute inset-0 h-5 w-5 opacity-100 group-open/quest:opacity-0"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <svg xmlns="http://www.w3.org/2000/svg" class="absolute inset-0 h-5 w-5 opacity-0 group-open/quest:opacity-100"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
      </div>
    </summary>

    <p class="my-4 leading-relaxed text-neutral-200">
      {{ quest.summary }}
    </p>

    <QuestTask v-for="task in quest.tasks.reverse()" :key="task.title" :task="task" />
  </details>
</template>
