<script setup lang="ts">
import Window from "@/components/Window.vue";
import { getItemName, isItemEquipable, isItemUsable } from "@shared/modules/items";
import { InventoryItem } from "@shared/interfaces";
import { computed } from "vue";
import { usePixel } from "@/composables/use-pixel";

const props = defineProps<{
  item: InventoryItem;
  x: number;
  y: number;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "use", item: InventoryItem): void;
  (e: "equip", item: InventoryItem): void;
  (e: "drop", item: InventoryItem): void;
}>();

const px = usePixel();

const itemName = computed(() => getItemName(props.item.data.key));
const isUsable = computed(() => isItemUsable(props.item.data.key));
const isEquipable = computed(() => isItemEquipable(props.item.data.key));

function executeAction(action: 'use' | 'equip' | 'drop') {
  // @ts-expect-error typescript is paranoid when typechecking function calls
  emit(action, props.item);
  emit("close");
}

const actions = computed(() => [
  {
    name: "Use",
    icon: "mdi-cursor-default-click-outline",
    enabled: isUsable.value,
    select: () => executeAction("use")
  },
  {
    name: "Equip",
    icon: "mdi-sword-cross",
    enabled: isEquipable.value,
    select: () => executeAction("equip")
  },
  {
    name: "Drop",
    icon: "mdi-place-item",
    select: () => executeAction("drop")
  }
]);
</script>

<template>
  <Window wrapper>

    <ul class="flex flex-col space-y-2">
      <li>
        <strong class="block text-xs font-medium uppercase text-gray-400">
          {{ itemName }}
        </strong>
        <ul class="space-y-1">
          <template v-for="action in actions">
            <li v-if="'enabled' in action === false || action.enabled" @click="action.select">
              <div
                class="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                <v-icon :icon="action.icon" />
                <span class="text-sm font-medium"> {{ action.name }} </span>
              </div>
            </li>
          </template>
        </ul>
      </li>
    </ul>
  </Window>
</template>
