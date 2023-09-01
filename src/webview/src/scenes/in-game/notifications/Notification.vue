<script setup lang="ts">
import { NotificationType } from "@shared/interfaces";

defineProps<{
  type: NotificationType;
  title: string;
  text: string;
}>();
</script>

<template>
  <div role="alert" class="rounded-xl border p-4 mb-2 shadow-xl border-gray-800 bg-gray-900 w-96">
    <div class="flex items-start gap-4">
      <span
        :class="[
          {
            error: 'text-red-600',
            success: 'text-green-600',
            info: 'text-blue-400',
          }[type],
        ]"
      >
        <v-icon
          :icon="
            {
              error: 'mdi-close-circle-outline',
              success: 'mdi-check-circle-outline',
              info: 'mdi-help-circle-outline',
            }[type]
          "
          class="h-6 w-6"
        />
      </span>

      <div class="flex-1">
        <strong class="block font-medium text-white">
          {{ title }}
        </strong>

        <p class="mt-1 text-sm text-gray-200">
          {{ text }}
        </p>
      </div>
    </div>
  </div>
</template>
