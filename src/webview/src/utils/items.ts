import { SlottedEquipmentItem, SlottedGroundItem, SlottedStorageItem } from "@/store/inventory.store";
import {
  EquipmentSlot,
  GroundItemSource,
  StorageItemSource,
  InventoryItem,
  ItemSourceOrigin,
  PlayerInventoryItemSource,
} from "@shared/interfaces";
import { Item, isItemKeyClothing, isItemKeyPants } from "@shared/modules/items";

export const getItemImage = (item: { key: string }) => {
  if (isItemKeyClothing(item.key)) {
    return `./assets/items/clothing/${item.key}.png`;
  }
  return `./assets/items/${item.key}.png`;
};

// function getFallback(item) {
//   let svg;
//   if (item.type === ItemType.MATERIAL) {
//     if (item.key.endsWith("_logs")) {
//       svg = getLogIcon(item.key);
//     }
//   }
//   return `url('data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}')`
// }

// function getLogIcon(key) {

// }

export const getItemIconScale = (item: { key: string }) => {
  if (isItemKeyClothing(item.key)) {
    return "contain";
  }
  return (
    {
      snowball: "40%",
    }[item.key] || "90%"
  );
};

export function getItemIconPosition(item: { key: string }) {
  if (isItemKeyPants(item.key)) {
    return "top center";
  }
  return "center";
}

export function getItemClasses(item: { key: string }) {
  if (isItemKeyClothing(item.key)) {
    return "brightness-125";
  }
  return;
}

export function getRandomDescription(itemName: string) {
  const descriptions = [
    "Just what it says on the tin.",
    "Exactly as advertised.",
    "Mystery-free, guaranteed.",
    "No frills, just function.",
    "It is what it is.",
    "Uncomplicated and straightforward.",
    "Plain, simple, and effective.",
    "What you see is what you get.",
    "No backstory, just utility.",
    "As basic as it gets.",
    "Straight to the point.",
    "Description not needed.",
    "Function over form.",
    "Simplicity is its charm.",
    "No bells and whistles.",
    "Practicality at its finest.",
    "Elegantly minimalistic.",
    "All name, no fluff."
  ];
  const hash = [...itemName].reduce((hash, char) => ((hash << 5) - hash) + char.charCodeAt(0) | 0, 0);
  const index = Math.abs(hash % descriptions.length);
  return descriptions[index];
}
