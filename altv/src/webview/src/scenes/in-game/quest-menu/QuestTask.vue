<script setup lang="ts">
import { computed } from "vue";
import { ClientEvents } from "@shared/events/client";
import { type QuestTaskInfo } from "@shared/store/client.store";
import { useAlt } from "@/composables/use-alt";
import { useClient } from "@/store/synced/client.store";
import Icon from "@/components/Icon/Icon.vue";

const props = defineProps<{
  task: QuestTaskInfo;
}>();

const alt = useAlt();
const client = useClient();

const questFacts = computed(() => client.questFacts);
const isCompleted = computed(() => questFacts.value.includes(props.task.completedFact));

function toggleSingle(e: Event) {
  if (e.currentTarget instanceof HTMLDetailsElement && !e.currentTarget.open) {
    document.querySelectorAll('[class*="group/task"]').forEach((node) => {
      if (node instanceof HTMLDetailsElement && node !== e.currentTarget && node.open) {
        node.open = false;
      }
    });
  }
}

function trackQuest(key: string) {
  alt.emit(ClientEvents.FromWebview.TRACK_QUEST, key);
}
</script>

<template>
  <details
    :class="[
      'group/task border-s-4 px-6 py-3 [&_summary::-webkit-details-marker]:hidden',
      isCompleted ? 'border-green-500' : 'border-orange-500',
    ]"
  >
    <summary
      @click="toggleSingle"
      class="flex cursor-pointer items-center justify-between gap-1.5 text-white"
    >
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

    <p class="mt-4 leading-relaxed text-neutral-200">
      {{ task.summary }}
    </p>
    <div
      v-if="!isCompleted"
      class="mt-3"
    >
      <button
        @click="trackQuest(task.completedFact)"
        class="inline-flex items-center gap-2 rounded border px-2 py-1 uppercase text-white focus:outline-none"
        :class="[
          client.trackingQuest === task.completedFact
            ? 'border-emerald-600 bg-emerald-600 hover:text-emerald-600'
            : 'border-neutral-600 bg-neutral-600 hover:text-neutral-600',
        ]"
      >
        <span class="text-xs font-medium">
          {{ client.trackingQuest === task.completedFact ? "Tracking" : "Track" }}
        </span>

        <Icon
          name="mdi:map-marker-plus-outline"
          class="w-4"
        />
      </button>
    </div>
  </details>
</template>
