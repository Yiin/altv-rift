<script setup lang="ts">
import { reactive } from "vue";
import { useAlt } from "@/composables/use-alt";
import { WebviewEvents } from "@shared/events/webview";
import { Notification, NotificationType } from "@shared/interfaces";
import NotificationMessage from "./Notification.vue";

const alt = useAlt();
const notifications = reactive<Notification[]>([]);

function showNotification(type: NotificationType, title: string, text: string) {
  const notification = {
    key: Date.now().toString(),
    type,
    title,
    text,
  };
  notifications.push(notification);

  setTimeout(() => {
    notifications.splice(notifications.indexOf(notification), 1);
  }, 5000);
}

alt.on(WebviewEvents.FromClient.SHOW_NOTIFICATION, showNotification);
</script>

<template>
  <transition-group name="notification" tag="div" class="absolute right-6 top-6">
    <NotificationMessage v-for="notification in notifications" v-bind="notification" />
  </transition-group>
</template>

<style>
.notification-move,
/* apply transition to moving elements */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.notification-leave-active {
  position: absolute;
}
</style>
