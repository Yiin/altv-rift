<script setup lang="ts">
import Screen from "@/components/Screen.vue";
import { useClient } from "@/store/synced/client.store";
import { computed } from "vue";

const client = useClient();

const conversation = computed(() => client.conversation);
</script>

<template>
  <div v-if="conversation" class="w-full h-full flex items-end justify-center">
    <div class="p-24 text-white text-shadow">
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold">{{ conversation.with }}</h1>
        <h2 v-if="conversation.topic" class="text-xl px-2 py-0.5 bg-gray-900 rounded">
          {{ conversation.topic }}
        </h2>
      </div>
      <p class="text-xl max-w-xl leading-snug mt-2">
        {{ conversation.pages[conversation.currentPage] }}
      </p>
      <div
        class="text-2xl flex gap-2 flex-col items-center mt-4 font-bold pb-4 uppercase tracking-wide"
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
                gray: 'text-gray-300',
                default: 'text-gray-300',
              }[option.color ?? 'default'],
          ]"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
  </div>
</template>
