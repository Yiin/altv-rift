<script setup lang="ts">
import { reactive, ref } from "vue";
import { WebviewEvents } from "@shared/events/webview";
import { type Notification, NotificationType } from "@shared/interfaces";
import { type Item } from "@shared/modules/items";
import { useAlt } from "@/composables/use-alt";
import GenericNotification from "./GenericNotification.vue";
import ItemReceivedNotification from "./ItemReceivedNotification.vue";

const alt = useAlt();
const notifications = reactive<Notification[]>([]);
const addedItem = ref<{
  timeout: any;
  item: Item;
} | null>(null);

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
alt.on(WebviewEvents.FromClient.INVENTORY_ITEM_ADD, async (item) => {
  if (addedItem.value) {
    clearTimeout(addedItem.value.timeout);
    addedItem.value = null;

    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  addedItem.value = {
    item,
    timeout: setTimeout(() => {
      addedItem.value = null;
    }, 4000),
  };
});
</script>

<template>
  <transition-group
    name="notification"
    tag="div"
    class="absolute right-6 top-6"
  >
    <GenericNotification
      v-for="notification in notifications"
      :key="notification.key"
      :type="notification.type"
      :title="notification.title"
      :text="notification.text"
    />
  </transition-group>
  <transition-group
    name="notification"
    tag="div"
    class="pointer-events-none absolute top-2/3 flex h-full w-full items-start justify-center"
  >
    <ItemReceivedNotification
      v-if="addedItem"
      :item="addedItem.item"
    />
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
  transform: translateY(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.notification-leave-active {
  position: absolute;
}
</style>
