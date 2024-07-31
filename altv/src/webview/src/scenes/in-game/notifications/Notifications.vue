<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { WebviewEvents } from "@shared/events/webview";
import { type NotificationSchema } from "@shared/interfaces";
import { type Item } from "@shared/modules/items";
import { useAlt } from "@/composables/use-alt";
import { useCharacter } from "@/store/synced/character.store";
import ItemReceivedNotification from "./ItemReceivedNotification.vue";
import ExperienceGainedNotification from "./ExperienceGainedNotification.vue";

const alt = useAlt();
const character = useCharacter();
const notifications = reactive<NotificationSchema[]>([]);
const addedItem = ref<{
  timeout: any;
  item: Item;
} | null>(null);

const experienceChanged = ref<{
  type: "fishing" | "mining" | "woodcutting";
  previousXp: number;
  currentXp: number;
}>();

const xp = computed(() => [
  character.skills.fishing,
  character.skills.mining,
  character.skills.woodcutting,
]);

let timeout: number | null;

watch(
  xp,
  (
    [currentFishing, currentMining, currentWoodcutting],
    [previousFishing, previousMining, previousWoordcutting],
  ) => {
    if (currentFishing > previousFishing) {
      experienceChanged.value = {
        type: "fishing",
        previousXp: previousFishing,
        currentXp: currentFishing,
      };
    } else if (currentMining > previousMining) {
      experienceChanged.value = {
        type: "mining",
        previousXp: previousMining,
        currentXp: currentMining,
      };
    } else if (currentWoodcutting > previousWoordcutting) {
      experienceChanged.value = {
        type: "woodcutting",
        previousXp: previousWoordcutting,
        currentXp: currentWoodcutting,
      };
    }

    if (experienceChanged.value) {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        experienceChanged.value = undefined;
        timeout = null;
      }, 5000);
    }
  },
);

alt.on(WebviewEvents.FromClient.SHOW_NOTIFICATION, (type, title, text) => {
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
});

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
  <!-- <transition-group
    name="notification"
    tag="div"
    class="absolute right-6 top-6"
  >
    <GenericNotification
      v-for="(notification, index) in notifications"
      :key="index"
      :type="notification.type"
      :title="''"
      :text="notification.text"
    />
  </transition-group> -->
  <transition-group
    name="notification"
    tag="div"
    class="pointer-events-none absolute top-30 flex h-full w-full items-start justify-center"
  >
    <ExperienceGainedNotification
      v-if="experienceChanged"
      v-bind="experienceChanged"
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
