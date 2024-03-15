<script setup lang="ts">
import { computed } from "vue";
import { useClient } from "@/store/synced/client.store";

const client = useClient();

const conversation = computed(() => client.conversation);
</script>

<template>
  <div
    v-if="conversation"
    class="flex h-full w-full items-end justify-center"
  >
    <div class="text-shadow p-24 text-white">
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold">{{ conversation.with }}</h1>
        <h2
          v-if="conversation.topic"
          class="rounded bg-neutral-900 px-2 py-0.5 text-xl"
        >
          {{ conversation.topic }}
        </h2>
      </div>
      <p class="mt-2 max-w-xl text-xl leading-snug">
        {{ conversation.pages[conversation.currentPage] }}
      </p>
      <div
        class="mt-4 flex flex-col items-center gap-2 pb-4 text-2xl font-bold uppercase tracking-wide"
      >
        <div
          v-for="(option, index) in conversation.options"
          :key="option.label"
          :class="[
            'transition-all duration-75',
            {
              'scale-75': conversation.selectedOption !== index,
            },
            conversation.selectedOption === index &&
              option.color &&
              {
                yellow: 'text-yellow-500',
                primary: 'text-yellow-500',
                red: 'text-red-600',
                danger: 'text-red-600',
                blue: 'text-blue-500',
                info: 'text-blue-500',
                purple: 'text-purple-500',
                special: 'text-purple-500',
                gray: 'text-neutral-300',
                default: 'text-neutral-300',
              }[option.color ?? 'default'],
          ]"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
  </div>
</template>
