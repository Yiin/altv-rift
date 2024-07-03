<script setup lang="ts">
import { NotificationType } from "@shared/interfaces";
import type { Notification } from "../plugins/notiwind";

const props = defineProps<{
  notification: Notification;
}>();
</script>

<template>
  <div
    class="bg-black-900/100 relative rounded-lg text-white backdrop-blur"
    role="alert"
  >
    <div
      class="flex items-center gap-4 rounded-lg p-4"
      :class="{
        'bg-red-900/10': props.notification.type === NotificationType.Error,
        'bg-green-900/10': props.notification.type === NotificationType.Success,
        'bg-blue-900/10': props.notification.type === NotificationType.Info,
        'bg-yellow-900/10': props.notification.type === NotificationType.Warning,
      }"
    >
      <div class="shrink-0">
        <div
          class="flex h-14 w-14 items-center justify-center rounded border text-xs"
          :class="{
            'border-red-500': props.notification.type === NotificationType.Error,
            'border-green-500': props.notification.type === NotificationType.Success,
            'border-blue-500': props.notification.type === NotificationType.Info,
            'border-yellow-500': props.notification.type === NotificationType.Warning,
          }"
        >
          icon
        </div>
      </div>
      <div class="grid gap-1">
        <div>
          <div
            class="inline-flex rounded p-1 text-xs font-semibold uppercase leading-none"
            :class="{
              'bg-red-500': props.notification.type === NotificationType.Error,
              'bg-green-500': props.notification.type === NotificationType.Success,
              'bg-blue-500': props.notification.type === NotificationType.Info,
              'bg-yellow-500': props.notification.type === NotificationType.Warning,
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
