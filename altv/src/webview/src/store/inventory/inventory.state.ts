import { computed, markRaw, reactive, ref } from "vue";
import { type Item } from "@shared/modules/items";
import {
  EquipmentSlot,
  type GroundItemSource,
  type StorageItemSource,
  ItemSourceOrigin,
  type PlayerEquipmentItemSource,
  type PlayerInventoryItemSource,
} from "@shared/interfaces";
import { isCharacterStoreAvailable, useCharacter } from "../synced/character.store";
import { useGameState } from "../synced/game-state.store";
import { useClient } from "../synced/client.store";
import {
  InventoryInteractionType,
  type ItemInteraction,
  type ItemNode,
  type SlottedEquipment,
  type SlottedGroundItem,
  type SlottedItem,
} from "./inventory.types";

const itemNodes = reactive<ItemNode[]>([]);
const currentInteraction = reactive<ItemInteraction>({ type: InventoryInteractionType.None });
const draggingItemThisFrame = ref(false);
const selectedItem = ref<SlottedItem>();
const previewingItem = ref<SlottedItem>();
const ammunitionPanelRef = ref<HTMLElement>();

const storage = computed(() => useGameState().openedStorage);
const droppedItems = computed(() => useClient().droppedItems);
const size = computed(() => useCharacter().inventory.size ?? 24);
const items = computed(() => {
  const character = useCharacter();

  const items: SlottedItem[] = reactive([]);

  if (!("altMock" in globalThis) && !isCharacterStoreAvailable()) {
    return items;
  }

  /**
   * Player inventory
   */
  const inventoryItems = character.inventory.items;

  for (const inventoryItem of inventoryItems) {
    items.push({
      item: inventoryItem.item,
      price: inventoryItem.price,
      source: {
        origin: ItemSourceOrigin.PlayerInventory,
        originId: character.id,
        inventorySlot: inventoryItem.slot,
      } satisfies PlayerInventoryItemSource,
    });
  }

  /**
   * Player equipment
   */
  const equipmentItems = Object.entries(character.equipment ?? {}).filter(([, item]) => !!item) as [
    EquipmentSlot,
    Item,
  ][];

  for (const [equipmentSlot, item] of equipmentItems) {
    items.push({
      item,
      source: {
        origin: ItemSourceOrigin.PlayerEquipment,
        originId: character.id,
        equipmentSlot,
      } satisfies PlayerEquipmentItemSource,
    });
  }

  /**
   * Opened storage inventory
   */
  if (storage.value) {
    const storageItems = storage.value.inventory.items;

    for (const item of storageItems) {
      items.push({
        item: item.item,
        price: item.price,
        source: {
          ...storage.value.source,
          inventorySlot: item.slot,
        } satisfies StorageItemSource,
      });
    }
  }

  /**
   * Nearby items
   */
  for (const groundItem of droppedItems.value) {
    items.push({
      item: groundItem.item,
      source: {
        origin: ItemSourceOrigin.Ground,
        originId: groundItem.id,
      } satisfies GroundItemSource,
    });
  }

  return items;
});

const inventoryItems = computed(() =>
  items.value.filter(
    (item): item is SlottedItem<PlayerInventoryItemSource> =>
      item.source.origin === ItemSourceOrigin.PlayerInventory,
  ),
);

const equipmentItems = computed(() =>
  items.value.filter(
    (item): item is SlottedItem<PlayerEquipmentItemSource> =>
      item.source.origin === ItemSourceOrigin.PlayerEquipment,
  ),
);

const interactionItems = computed(() =>
  items.value.filter(
    (item): item is SlottedItem<StorageItemSource> =>
      item.source.origin === ItemSourceOrigin.Storage,
  ),
);

const groundItems = computed(() =>
  items.value
    .filter((item): item is SlottedGroundItem => item.source.origin === ItemSourceOrigin.Ground)
    .slice(0, 24),
);

const slottedEquipment = computed(() => {
  const equipment: SlottedEquipment = {
    mask: null,
    glasses: null,
    headwear: null,
    earrings: null,
    top: null,
    armor: null,
    accessory: null,
    weapon: null,
    gloves: null,
    lefthand: null,
    pants: null,
    righthand: null,
    backpack: null,
    shoes: null,
    phone: null,
  };

  for (const item of equipmentItems.value) {
    const equipmentSlot = item.source.equipmentSlot;
    // @ts-expect-error item is guaranteed to be of correct type,
    // but TS is complaining that e.g. ClothingItem might be on weapon slot
    equipment[equipmentSlot] = item;
  }
  return equipment;
});

export function getItemNodes() {
  return itemNodes;
}

export function getItems() {
  return items.value;
}

export function getInventorySize() {
  return size.value;
}

export function getCurrentInventoryInteraction() {
  return currentInteraction;
}

export function getSelectedItem() {
  return selectedItem.value;
}

export function getPreviewingItem() {
  return previewingItem.value;
}

export function getAmmunitionPanelRef() {
  return ammunitionPanelRef.value;
}

export function isDraggingItemThisFrame() {
  return draggingItemThisFrame.value;
}

export function getInventoryItems() {
  return inventoryItems.value;
}

export function getEquipmentItems() {
  return equipmentItems.value;
}

export function getInteractionItems() {
  return interactionItems.value;
}

export function getGroundItems() {
  return groundItems.value;
}

export function getSlottedEquipment() {
  return slottedEquipment.value;
}

export function registerItemSlot(slot: ItemNode) {
  itemNodes.push(markRaw(slot));
}

export function unregisterItemSlot(slot: ItemNode) {
  const index = itemNodes.findIndex((s) => s.source === slot.source);
  if (index !== -1) {
    itemNodes.splice(index, 1);
  }
}

export function setCurrentInventoryInteraction(interaction: ItemInteraction) {
  for (const key in currentInteraction) {
    if (key !== "type" && !(key in interaction)) {
      // @ts-expect-error
      delete currentInteraction[key];
    }
  }
  Object.assign(currentInteraction, interaction);
}

export function setSelectedItem(item: SlottedItem) {
  selectedItem.value = item;
}

export function setPreviewingItem(item: SlottedItem) {
  previewingItem.value = item;
}

export function setAmmunitionPanelRef(ref: HTMLElement) {
  ammunitionPanelRef.value = ref;
}

export function setDraggingItemThisFrame(value: boolean) {
  draggingItemThisFrame.value = value;
}

export function clearSelectedItem() {
  selectedItem.value = undefined;
}

export function clearPreviewingItem() {
  previewingItem.value = undefined;
}

export function clearCurrentInventoryInteraction() {
  setCurrentInventoryInteraction({ type: InventoryInteractionType.None });
}

export function clearItemNodes() {
  itemNodes.splice(0, itemNodes.length);
}

export function clearAmmunitionPanelRef() {
  ammunitionPanelRef.value = undefined;
}

export function clearDraggingItemThisFrame() {
  draggingItemThisFrame.value = false;
}

export function resetInventoryState() {
  clearItemNodes();
  clearSelectedItem();
  clearPreviewingItem();
  clearDraggingItemThisFrame();
  clearCurrentInventoryInteraction();
}
