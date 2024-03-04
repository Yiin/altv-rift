<script setup lang="ts">
import Window from "@/components/Window.vue";
import {
  CombineType,
  getCombineType,
  getItemName,
  isItemEquipable,
  isItemUsable,
  isItemFirearmWeapon,
  isItemFishingRod
} from "@shared/modules/items";
import { computed } from "vue";
import { InteractionType, ItemActionMenu, useInventory } from "@/store/inventory.store";
import { isItemPreviewable } from "@shared/modules/items/lib/is-item-previewable";
import { StorageItemSource, ItemSourceOrigin, PlayerInventoryItemSource, PlayerItemSource } from "@shared/interfaces";
import { useShop } from "@/store/shop.store";

const props = defineProps<ItemActionMenu>();

const inventory = useInventory();
const shop = useShop();

const item = computed(() => props.item.item);
const itemSource = computed(() => props.item.source);

const isInShop = computed(() => shop.isInShop);
const visible = computed(() => inventory.currentInteraction.type === InteractionType.ContextMenu);
const itemName = computed(() => getItemName(item.value.key));
const isUsable = computed(
  () => !isInShop.value && [ItemSourceOrigin.PlayerInventory, ItemSourceOrigin.Storage].includes(itemSource.value.origin) && isItemUsable(item.value.key)
);
const isBuyable = computed(() => isInShop.value && itemSource.value.origin === ItemSourceOrigin.Storage);
const isSellable = computed(() => isInShop.value && itemSource.value.origin === ItemSourceOrigin.PlayerInventory);
const isEquipable = computed(
  () => !isInShop.value && [ItemSourceOrigin.PlayerInventory, ItemSourceOrigin.Storage].includes(itemSource.value.origin) && isItemEquipable(item.value.key)
);
const isUnequipable = computed(() => itemSource.value.origin === ItemSourceOrigin.PlayerEquipment);
const isDroppable = computed(() => !isInShop.value && [ItemSourceOrigin.PlayerInventory, ItemSourceOrigin.PlayerEquipment].includes(itemSource.value.origin));
const hasAmmo = computed(() => !isInShop.value && isItemFirearmWeapon(item.value) && !!item.value.clip);
const hasFishBait = computed(() => !isInShop.value && isItemFishingRod(item.value) && !!item.value.bait);
const isPreviewable = computed(() => !isInShop.value && isItemPreviewable(item.value.key));

const combine = computed(() => {
  if ([ItemSourceOrigin.PlayerInventory, ItemSourceOrigin.Storage].includes(itemSource.value.origin)) {
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

function executeAction(action: string) {
  inventory.closeActionMenu();

  const source = itemSource.value;

  switch (action) {
    case "use":
      if (source.origin !== ItemSourceOrigin.PlayerInventory) {
        return;
      }
      inventory.useItem(source);
      break;
    case "equip":
      if ([ItemSourceOrigin.PlayerInventory, ItemSourceOrigin.Storage].includes(itemSource.value.origin)) {
        return;
      }
      inventory.equipItem(source as PlayerInventoryItemSource | StorageItemSource);
      break;
    case "preview":
      inventory.previewingItem = props.item;
      break;
    case "unequip":
      if (source.origin !== ItemSourceOrigin.PlayerEquipment) {
        return;
      }
      inventory.unequipItem(source.equipmentSlot);
      break;
    case "drop":
      inventory.dropFromMenu(source as PlayerItemSource);
      break;
    case "load-ammo":
      if (inventory.selectedItem) {
        if (combine.value.reverse) {
          inventory.combineItems(inventory.selectedItem.source, source);
        } else {
          inventory.combineItems(source, inventory.selectedItem.source);
        }
      }
      break;
    case "unload-ammo":
      inventory.unloadAmmo(source);
      break;
    case "remove-bait":
      inventory.removeBait(source);
      break;
  }
}

const actions = computed(() => [
  {
    name: "Buy",
    icon: "mdi-currency-eur",
    enabled: isBuyable.value,
    select: () => executeAction("buy"),
  },
  {
    name: "Sell",
    icon: "mdi-currency-eur",
    enabled: isSellable.value,
    select: () => executeAction("sell"),
  },
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
    name: "Preview",
    icon: "mdi-cursor-default-click-outline",
    enabled: isPreviewable.value,
    select: () => executeAction("preview"),
  },
  {
    name: "Unequip",
    icon: "mdi-sword-cross",
    enabled: isUnequipable.value,
    select: () => executeAction("unequip"),
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
    name: "Remove bait",
    icon: "mdi-chart-bubble",
    enabled: hasFishBait.value,
    select: () => executeAction("remove-bait"),
  },
  {
    name: "Drop",
    icon: "mdi-place-item",
    enabled: isDroppable.value,
    select: () => executeAction("drop"),
  },
]);
</script>

<template>
  <div v-if="visible" :key="ts" class="absolute top-0 left-0 flex justify-start"
    v-click-outside="inventory.closeActionMenu">
    <Window v-bind="{ x, y, h: 'auto' }" :is-active="false" :is-draggable="false" @mousedown.stop>
      <ul class="flex flex-col space-y-2 bg-neutral-800 rounded-lg overflow-hidden shadow-lg">
        <li>
          <strong class="py-3 px-4 block text-sm font-medium uppercase text-neutral-400">
            {{ itemName }}
          </strong>
          <ul>
            <template v-for=" action  in  actions ">
              <li v-if="'enabled' in action === false || action.enabled" @mousedown.stop="action.select"
                class="border-t border-t-neutral-700">
                <div
                  class="flex items-center gap-4 px-4 py-3 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 cursor-pointer">
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
