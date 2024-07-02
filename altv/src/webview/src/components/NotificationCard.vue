<script setup lang="ts">
import type { NotificationSchema } from '../notiwind'

const props = defineProps<{
  notification: NotificationSchema
}>()
</script>

<template>
  <div
    class="relative text-white rounded-lg bg-black-900/100 backdrop-blur"
    role="alert"
  >
    <div
      class="flex items-center gap-4 p-4 rounded-lg"
      :class="{
        'bg-red-900/10': props.notification.type === 'error',
        'bg-green-900/10': props.notification.type === 'success',
        'bg-blue-900/10': props.notification.type === 'info',
        'bg-yellow-900/10': props.notification.type === 'warning'
      }"
    >
      <div class="shrink-0">
        <div
          class="flex items-center justify-center text-xs border rounded w-14 h-14"
          :class="{
            'border-red-500': props.notification.type === 'error',
            'border-green-500': props.notification.type === 'success',
            'border-blue-500': props.notification.type === 'info',
            'border-yellow-500': props.notification.type === 'warning'
          }"
        >
          icon
        </div>
      </div>
      <div class="grid gap-1">
        <div>
          <div
            class="inline-flex p-1 text-xs font-semibold leading-none uppercase rounded"
            :class="{
              'bg-red-500': props.notification.type === 'error',
              'bg-green-500': props.notification.type === 'success',
              'bg-blue-500': props.notification.type === 'info',
              'bg-yellow-500': props.notification.type === 'warning'
            }"
          >
            {{ props.notification.type }}
          </div>
        </div>
        <div class="text-lg font-bold leading-tight">{{ props.notification.text }}</div>
      </div>
    </div>
  </div>
</template>