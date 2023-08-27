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

const item = computed(() => props.item.item);
const itemSource = computed(() => props.item.source);

const visible = computed(() => inventory.currentInteraction.type === InteractionType.ContextMenu);
const itemName = computed(() => getItemName(item.value.key));
const isUsable = computed(
  () => itemSource.value.type === "inventory" && isItemUsable(item.value.key)
);
const isEquipable = computed(
  () => itemSource.value.type === "inventory" && isItemEquipable(item.value.key)
);
const hasAmmo = computed(
  () => !!(item.value.type === ItemType.FIREARM_WEAPON && getItemData(item.value).ammo)
);

const combine = computed(() => {
  if (itemSource.value.type !== "inventory") {
    return {
      type: CombineType.None,
      reverse: false,
    };
  }

  if (!inventory.selectedItem) {
    return {
      type: CombineType.None,
      reverse: false,
    };
  }

  const target = item.value.key;
  const source = inventory.selectedItem.item.key;

  const [type, reverse] = getCombineType(target, source);

  return {
    type,
    reverse,
  };
});

const canLoadAmmo = computed(() => combine.value.type === CombineType.EquipAmmo);

function executeAction(action: "use" | "equip" | "drop" | "unload-ammo" | "load-ammo") {
  inventory.closeActionMenu();

  const source = itemSource.value;

  switch (action) {
    case "use":
      inventory.useItem(source);
      break;
    case "equip":
      inventory.equipItem(source);
      break;
    case "drop":
      inventory.dropFromMenu(props.item);
      break;
    case "load-ammo":
      if (inventory.selectedItem) {
        if (combine.value.reverse) {
          inventory.loadAmmo(inventory.selectedItem.source, source);
        } else {
          inventory.loadAmmo(source, inventory.selectedItem.source);
        }
      }
      break;
    case "unload-ammo":
      inventory.unloadAmmo(source);
      break;
  }
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
