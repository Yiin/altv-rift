<script setup lang="ts">
import { NotificationType } from "@shared/interfaces";
import { asset } from "@/utils/asset";
import type { Notification } from "../plugins/notiwind";

const props = defineProps<{
  notification: Notification;
}>();
</script>

<template>
  <div
    class="bg-black-900/100 relative rounded-lg text-white"
    role="alert"
  >
    <div
      class="flex items-center gap-4 rounded-lg p-4"
      :class="{
        'bg-[#110000]/85': props.notification.type === NotificationType.Error,
        'bg-[#0E1400]/85': props.notification.type === NotificationType.Success,
        'bg-[#000E1F]/85': props.notification.type === NotificationType.Info,
        'bg-black/85': props.notification.type === NotificationType.Warning,
      }"
      :style="[
        props.notification.type === NotificationType.Warning && {
          'background-image': `url(${asset('assets/notifications/warning-background.svg')})`,
          backgroundRepeat: 'repeat',
        },
      ]"
    >
      <div class="shrink-0">
        <div
          class="flex h-14 w-14 items-center justify-center rounded border text-xs"
          :class="{
            'border-[#FF24311F]': props.notification.type === NotificationType.Error,
            'border-[#A3DF221F]': props.notification.type === NotificationType.Success,
            'border-[#2087FF1F]': props.notification.type === NotificationType.Info,
            'border-[#F2CB401F] bg-[#252210]': props.notification.type === NotificationType.Warning,
          }"
        >
          icon
        </div>
      </div>
      <div class="grid gap-1">
        <div class="text-lg font-semibold leading-tight">{{ props.notification.text }}</div>
      </div>
    </div>
  </div>
</template>
