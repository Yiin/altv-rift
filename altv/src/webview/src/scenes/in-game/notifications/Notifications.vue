<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { WebviewEvents } from "@shared/events/webview";
import { type Item } from "@shared/modules/items";
import { useAlt } from "@/composables/use-alt";
import { useCharacter } from "@/store/synced/character.store";
import { useToast } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toast";
import ItemReceivedNotification from "./ItemReceivedNotification.vue";
import ExperienceGainedNotification from "./ExperienceGainedNotification.vue";

const alt = useAlt();
const character = useCharacter();
const { toast } = useToast();

// Experience notification state
const experienceChanged = ref<{
  type: keyof typeof character.skills;
  previousXp: number;
  currentXp: number;
}>();

let experienceTimeout: number | null = null;

// Item notification state
const addedItem = ref<{
  item: Item;
  timeout: number;
} | null>(null);

// Skills XP computed
const skillsXp = computed(() => ({
  fishing: character.skills.fishing.exp,
  mining: character.skills.mining.exp,
  woodcutting: character.skills.woodcutting.exp,
  crafting: character.skills.crafting.exp,
  medic: character.skills.medic.exp,
  engineer: character.skills.engineer.exp,
  farmer: character.skills.farmer.exp,
  foodDelivery: character.skills.foodDelivery.exp,
  cargoCarrier: character.skills.cargoCarrier.exp,
  firefighter: character.skills.firefighter.exp,
  builder: character.skills.builder.exp,
  electrician: character.skills.electrician.exp,
  plumber: character.skills.plumber.exp,
  mechanic: character.skills.mechanic.exp,
  gardener: character.skills.gardener.exp,
  mortician: character.skills.mortician.exp,
}));

// Watch for XP changes
watch(skillsXp, (current, previous) => {
  const changedSkill = (Object.keys(current) as Array<keyof typeof current>).find(
    (skill) => current[skill] > (previous?.[skill] ?? 0),
  );

  if (changedSkill) {
    experienceChanged.value = {
      type: changedSkill,
      previousXp: previous?.[changedSkill] ?? 0,
      currentXp: current[changedSkill],
    };

    if (experienceTimeout) {
      clearTimeout(experienceTimeout);
    }

    experienceTimeout = setTimeout(() => {
      experienceChanged.value = undefined;
      experienceTimeout = null;
    }, 5000);
  }
});

alt.on(WebviewEvents.FromClient.INVENTORY_ITEM_ADD, async (item) => {
  if (addedItem.value?.timeout) {
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

// Generic notifications
alt.on(WebviewEvents.FromClient.SHOW_NOTIFICATION, (type, text, { title } = {}) => {
  const defaultTitle = {
    error: "Uh oh! Something went wrong.",
    success: "Success!",
    info: "Info",
    warning: "Warning!",
  }[type];

  toast({
    title: title || defaultTitle,
    description: text,
    variant: type === "error" ? "destructive" : type,
  });
});
</script>

<template>
  <Toaster />
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
