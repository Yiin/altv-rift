<script setup lang="ts">
import { useClient } from "@/store/synced/client.store";
import { QuestTask } from "@shared/store/client.store";
import { computed } from "vue";

defineProps<{
  task: QuestTask;
}>();

const client = useClient();

const questFacts = computed(() => client.questFacts);

function toggleSingle(e: Event) {
  if (e.currentTarget instanceof HTMLDetailsElement && !e.currentTarget.open) {
    document.querySelectorAll('[class*="group/task"]').forEach((node) => {
      if (node instanceof HTMLDetailsElement && node !== e.currentTarget && node.open) {
        node.open = false;
      }
    });
  }
}
</script>

<template>
  <details
    :class="[
      'group/task border-s-4 px-6 py-3 [&_summary::-webkit-details-marker]:hidden',
      questFacts.includes(task.completedFact) ? 'border-green-500' : 'border-orange-500',
    ]"
    @click="toggleSingle"
  >
    <summary class="flex cursor-pointer items-center justify-between gap-1.5 text-white">
      <h2 class="text-lg font-medium">
        {{ task.title }}
      </h2>

      <span class="relative h-5 w-5 shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="absolute inset-0 h-5 w-5 opacity-100 group-open/task:opacity-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="absolute inset-0 h-5 w-5 opacity-0 group-open/task:opacity-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </span>
    </summary>

    <p class="mt-4 leading-relaxed text-gray-200">
      {{ task.summary }}
    </p>
  </details>
</template>
