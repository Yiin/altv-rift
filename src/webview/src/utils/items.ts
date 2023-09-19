import { isItemKeyClothing, isItemKeyPants, isItemKeyTop } from "@shared/modules/items";

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
    return 'brightness-125';
  }
  return;
}
