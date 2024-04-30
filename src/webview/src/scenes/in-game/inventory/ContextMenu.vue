<script setup lang="ts">
import { computed } from "vue";
import {
  CombineType,
  getCombineType,
  getItemName,
  isItemEquipable,
  isItemUsable,
  isItemFirearmWeapon,
  isItemFishingRod,
} from "@shared/modules/items";
import { isItemPreviewable } from "@shared/modules/items/lib/is-item-previewable";
import {
  type StorageItemSource,
  ItemSourceOrigin,
  type PlayerInventoryItemSource,
  type PlayerItemSource,
} from "@shared/interfaces";
import { InteractionType, type ItemActionMenu, useInventory } from "@/store/inventory.store";
import Window from "@/components/Window.vue";
import { useShop } from "@/store/shop.store";

const props = defineProps<ItemActionMenu>();

const {
  currentInteraction,
  selectedItem,
  previewingItem,
  useItem,
  equipItem,
  unequipItem,
  dropFromMenu,
  combineItems,
  unloadAmmo,
  removeBait,
  closeActionMenu,
} = useInventory();
const shop = useShop();

const item = computed(() => props.item.item);
const itemSource = computed(() => props.item.source);

const isInShop = computed(() => shop.isInShop);
const visible = computed(() => currentInteraction.value.type === InteractionType.ContextMenu);
const itemName = computed(() => getItemName(item.value.key));

const isUsable = computed(
  () =>
    !isInShop.value &&
    [ItemSourceOrigin.PlayerInventory, ItemSourceOrigin.Storage].includes(
      itemSource.value.origin,
    ) &&
    isItemUsable(item.value.key),
);

const isBuyable = computed(
  () => isInShop.value && itemSource.value.origin === ItemSourceOrigin.Storage,
);

const isSellable = computed(
  () => isInShop.value && itemSource.value.origin === ItemSourceOrigin.PlayerInventory,
);

const isEquipable = computed(
  () =>
    !isInShop.value &&
    [ItemSourceOrigin.PlayerInventory, ItemSourceOrigin.Storage].includes(
      itemSource.value.origin,
    ) &&
    isItemEquipable(item.value.key),
);

const isUnequipable = computed(() => itemSource.value.origin === ItemSourceOrigin.PlayerEquipment);

const isDroppable = computed(
  () =>
    !isInShop.value &&
    [ItemSourceOrigin.PlayerInventory, ItemSourceOrigin.PlayerEquipment].includes(
      itemSource.value.origin,
    ),
);

const hasAmmo = computed(
  () => !isInShop.value && isItemFirearmWeapon(item.value) && !!item.value.clip,
);

const hasFishBait = computed(
  () => !isInShop.value && isItemFishingRod(item.value) && !!item.value.bait,
);

const isPreviewable = computed(() => !isInShop.value && isItemPreviewable(item.value.key));

const combine = computed(() => {
  if (
    [ItemSourceOrigin.PlayerInventory, ItemSourceOrigin.Storage].includes(itemSource.value.origin)
  ) {
    return {
      type: CombineType.None,
      reverse: false,
    };
  }

  if (!selectedItem.value) {
    return {
      type: CombineType.None,
      reverse: false,
    };
  }

  const target = item.value.key;
  const source = selectedItem.value.item.key;

  const [type, reverse] = getCombineType(target, source);

  return {
    type,
    reverse,
  };
});

const canLoadAmmo = computed(() => combine.value.type === CombineType.EquipAmmo);

function executeAction(action: string) {
  closeActionMenu();

  const source = itemSource.value;

  switch (action) {
    case "use":
      if (source.origin !== ItemSourceOrigin.PlayerInventory) {
        return;
      }
      useItem(source);
      break;
    case "equip":
      if (
        [ItemSourceOrigin.PlayerInventory, ItemSourceOrigin.Storage].includes(
          itemSource.value.origin,
        )
      ) {
        return;
      }
      equipItem(source as PlayerInventoryItemSource | StorageItemSource);
      break;
    case "preview":
      previewingItem.value = props.item;
      break;
    case "unequip":
      if (source.origin !== ItemSourceOrigin.PlayerEquipment) {
        return;
      }
      unequipItem(source.equipmentSlot);
      break;
    case "drop":
      dropFromMenu(source as PlayerItemSource);
      break;
    case "load-ammo":
      if (selectedItem.value) {
        if (combine.value.reverse) {
          combineItems(selectedItem.value.source, source);
        } else {
          combineItems(source, selectedItem.value.source);
        }
      }
      break;
    case "unload-ammo":
      unloadAmmo(source);
      break;
    case "remove-bait":
      removeBait(source);
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
  <div
    v-if="visible"
    :key="ts"
    class="absolute left-0 top-0 flex justify-start"
    v-click-outside="closeActionMenu"
  >
    <Window
      v-bind="{ x, y, h: 'auto' }"
      :is-active="false"
      :is-draggable="false"
      @mousedown.stop
    >
      <ul class="flex flex-col space-y-2 overflow-hidden rounded-lg bg-neutral-800 shadow-lg">
        <li>
          <strong class="block px-4 py-3 text-sm font-medium uppercase text-neutral-400">
            {{ itemName }}
          </strong>
          <ul>
            <template v-for="action in actions">
              <li
                v-if="'enabled' in action === false || action.enabled"
                :key="action.name"
                @mousedown.stop="action.select"
                class="border-t border-t-neutral-700"
              >
                <div
                  class="flex cursor-pointer items-center gap-4 bg-neutral-800 px-4 py-3 text-neutral-200 hover:bg-neutral-700"
                >
                  <v-icon
                    :icon="action.icon"
                    size="sm"
                  />
                  <span class="-mt-0.5 text-sm font-medium">{{ action.name }}</span>
                </div>
              </li>
            </template>
          </ul>
        </li>
      </ul>
    </Window>
  </div>
</template>
