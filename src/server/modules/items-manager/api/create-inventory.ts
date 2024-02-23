import { Item } from "@shared/modules/items";

export function createInventory(options: { size: number } & ({ items: Item[] } | { pricedItems: { item: Item, price: number }[] })) {
  return {
    size: options.size,
    items: 'items' in options
      ? options.items.map((item, slot) => ({ item, slot, price: null }))
      : options.pricedItems.map(({ item, price }, slot) => ({ item, slot, price })),
  };
}
