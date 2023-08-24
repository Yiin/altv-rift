<script setup lang="ts">
import Window from "@/components/Window.vue";
import {
  CombineType,
  getCombineType,
  getItemData,
  getItemName,
  isItemEquipable,
  isItemUsable,
} from "@shared/modules/items";
import { computed } from "vue";
import { InteractionType, ItemActionMenu, useInventory } from "@/store/inventory.store";
import { ItemType } from "@prisma/client";

const props = defineProps<ItemActionMenu>();

const inventory = useInventory();

const visible = computed(() => inventory.currentInteraction.type === InteractionType.ContextMenu);
const itemName = computed(() => getItemName(props.item.data.key));
const isUsable = computed(() => isItemUsable(props.item.data.key));
const isEquipable = computed(() => isItemEquipable(props.item.data.key));
const hasAmmo = computed(
  () => !!(props.item.data.type === ItemType.FIREARM_WEAPON && getItemData(props.item.data).ammo)
);
const canLoadAmmo = computed(() => {
  if (!inventory.selectedItem) {
    return false;
  }
  const target = props.item.data.key;
  const source = inventory.selectedItem.data.key;

  const [combineType, reverse] = getCombineType(target, source);

  switch (combineType) {
    case CombineType.EquipAmmo:
      return true;
  }

  return false;
});

function executeAction(action: "use" | "equip" | "drop" | "unload-ammo" | "load-ammo") {
  switch (action) {
    case "use":
      inventory.useItem(props.item.slot);
      break;
    case "equip":
      inventory.equipItem(props.item.slot);
      break;
    case "drop":
      inventory.dropFromMenu(props.item);
      break;
    case "load-ammo":
      if (inventory.selectedItem) {
        inventory.loadAmmo(props.item.slot, inventory.selectedItem.slot);
      }
      break;
    case "unload-ammo":
      inventory.unloadAmmo(props.item.slot);
      break;
  }
  inventory.closeActionMenu();
}

const actions = computed(() => [
  {
    name: "Use",
    icon: "mdi-cursor-default-click-outline",
    enabled: isUsable.value,
    select: () => executeAction("use"),
  },
  {
    name: "Equip",
    icon: "mdi-sword-cross",
    enabled: isEquipable.value,
    select: () => executeAction("equip"),
  },
  {
    name: "Load ammo",
    icon: "mdi-ammunition",
    enabled: canLoadAmmo.value,
    select: () => executeAction("load-ammo"),
  },
  {
    name: "Unload ammo",
    icon: "mdi-ammunition",
    enabled: hasAmmo.value,
    select: () => executeAction("unload-ammo"),
  },
  {
    name: "Drop",
    icon: "mdi-place-item",
    select: () => executeAction("drop"),
  },
]);
</script>

<template>
  <div
    v-if="visible"
    :key="ts"
    class="absolute flex justify-start"
    @click.stop
    v-click-outside="inventory.closeActionMenu"
  >
    <Window v-bind="{ x, y }" :is-active="false">
      <ul class="flex flex-col space-y-2 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <li>
          <strong class="py-3 px-4 block text-sm font-medium uppercase text-gray-400">
            {{ itemName }}
          </strong>
          <ul>
            <template v-for="action in actions">
              <li
                v-if="'enabled' in action === false || action.enabled"
                @mousedown="action.select"
                class="border-t border-t-gray-700"
              >
                <div
                  class="flex items-center gap-4 px-4 py-3 bg-gray-800 text-gray-200 hover:bg-gray-700 cursor-pointer"
                >
                  <v-icon :icon="action.icon" size="sm" />
                  <span class="text-sm font-medium -mt-0.5">{{ action.name }}</span>
                </div>
              </li>
            </template>
          </ul>
        </li>
      </ul>
    </Window>
  </div>
</template>
