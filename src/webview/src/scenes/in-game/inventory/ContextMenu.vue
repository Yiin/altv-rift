<script setup lang="ts">
import Window from "@/components/Window.vue";
import { getItemName, isItemEquipable, isItemUsable } from "@shared/modules/items";
import { InventoryItem } from "@shared/interfaces";
import { computed } from "vue";
import { px } from "@/composables/use-pixel";

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
  <Window v-bind="{ x, y }" :is-active="false">
    <ul class="flex flex-col space-y-2 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <li>
        <strong class="py-3 px-4 block text-sm font-medium uppercase text-gray-400">
          {{ itemName }}
        </strong>
        <ul class="space-y-1">
          <template v-for="action in actions">
            <li v-if="'enabled' in action === false || action.enabled" @click="action.select">
              <div class="flex items-center gap-4 px-4 py-3 bg-gray-800 text-gray-200 hover:bg-gray-700 cursor-pointer">
                <v-icon :icon="action.icon" class="w-4 h-4" />
                <span class="text-sm font-medium"> {{ action.name }} </span>
              </div>
            </li>
          </template>
        </ul>
      </li>
    </ul>
  </Window>
</template>
