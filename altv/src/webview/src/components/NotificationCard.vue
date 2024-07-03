<script setup lang="ts">
import type { Notification } from '../plugins/notiwind'
import { NotificationType } from '../plugins/notiwind'

const props = defineProps<{
  notification: Notification
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
        'bg-red-900/10': props.notification.type === NotificationType.Error,
        'bg-green-900/10': props.notification.type === NotificationType.Success,
        'bg-blue-900/10': props.notification.type === NotificationType.Info,
        'bg-yellow-900/10': props.notification.type === NotificationType.Warning
      }"
    >
      <div class="shrink-0">
        <div
          class="flex items-center justify-center text-xs border rounded w-14 h-14"
          :class="{
            'border-red-500': props.notification.type === NotificationType.Error,
            'border-green-500': props.notification.type === NotificationType.Success,
            'border-blue-500': props.notification.type === NotificationType.Info,
            'border-yellow-500': props.notification.type === NotificationType.Warning
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
              'bg-red-500': props.notification.type === NotificationType.Error,
              'bg-green-500': props.notification.type === NotificationType.Success,
              'bg-blue-500': props.notification.type === NotificationType.Info,
              'bg-yellow-500': props.notification.type === NotificationType.Warning
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