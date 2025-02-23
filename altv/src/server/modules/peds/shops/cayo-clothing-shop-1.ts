import alt from "@altv/server";
import { createItem, Top, Headwear, Mask, Gloves, Pants, Accessory } from "@shared/modules/items";
import { setupShop } from "@/modules/shops/lib/setup-shop";
import { StorageType } from "@shared/store/game-state.store";

const CLOTHING_CATEGORIES = {
  Top,
  Headwear,
  Mask,
  Gloves,
  Pants,
  Accessory,
} as const;

function getRandomItems(count: number) {
  const items = [];
  const categories = Object.entries(CLOTHING_CATEGORIES);

  for (let i = 0; i < count; i++) {
    // Pick a random category
    const [categoryName, category] = categories[Math.floor(Math.random() * categories.length)];

    // Get all item keys from that category
    const itemKeys = Object.values(category);

    // Pick a random item key
    const randomKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];

    // Generate a random price between 100 and 1000
    const price = Math.floor(Math.random() * 900) + 100;

    items.push({
      slot: i,
      item: createItem(randomKey),
      price,
    });
  }

  return items;
}

const positions: { pos: alt.IVector3; heading: number }[] = [
  {
    pos: { x: 4476.591, y: -4485.673, z: 4.1902 },
    heading: 0, // You may want to adjust this heading based on your needs
  },
];

for (const { pos, heading } of positions) {
  setupShop({
    id: "cayo-clothing-shop-1",
    name: "Cayo Clothing Shop",
    ped: {
      model: "A_F_Y_Beach_01",
      pos,
      heading,
    },
    inventory: {
      size: 20,
      items: getRandomItems(20),
    },
  });
}
