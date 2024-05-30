import {
  type GroundItemSource,
  type StorageItemSource,
  type ItemSource,
  ItemSourceOrigin,
  type PlayerEquipmentItemSource,
  type PlayerInventoryItemSource,
} from "@shared/interfaces";
import { getItemNodes, getItems } from "./inventory.state";
import type { SlottedItem } from "./inventory.types";

export function fromItemSource(source: ItemSource) {
  switch (source.origin) {
    case ItemSourceOrigin.Ground:
      return {};
    default:
      return source;
  }
}

export function isSameSourceOrigin<A extends ItemSource, B extends ItemSource>(
  a: A,
  b: B,
): boolean {
  return a.origin === b.origin && a.originId === b.originId;
}

export function isSameItemSource<A extends ItemSource, B extends ItemSource>(a?: A, b?: B): boolean;
export function isSameItemSource<A extends ItemSource, B extends Partial<ItemSource>>(
  a?: A,
  b?: B,
): a is A & B;
export function isSameItemSource<A extends ItemSource, B extends PlayerInventoryItemSource>(
  a?: A,
  b?: B,
): a is A & B;
export function isSameItemSource<A extends ItemSource, B extends PlayerEquipmentItemSource>(
  a?: A,
  b?: B,
): a is A & B;
export function isSameItemSource<A extends ItemSource, B extends StorageItemSource>(
  a?: A,
  b?: B,
): a is A & B;
export function isSameItemSource<A extends ItemSource, B extends GroundItemSource>(
  a?: A,
  b?: B,
): a is A & B;
export function isSameItemSource(a?: ItemSource, b?: ItemSource): boolean {
  if (!a || !b) {
    return false;
  }

  return Object.entries(b).every(([key, value]) => a[key as keyof ItemSource] === value);
}

export function getItemFromSource<T extends ItemSource>(source: T) {
  return getItems().find((item): item is SlottedItem<T> => isSameItemSource(item.source, source));
}

export function getNodeRect(node?: HTMLElement) {
  if (!node) {
    return null;
  }

  const cache = node.cache;

  if (cache && cache.freshUntil > Date.now()) {
    return cache.rect;
  }

  const rect = node.parentElement?.classList.contains("node-anchor")
    ? node.parentElement.getBoundingClientRect()
    : node.getBoundingClientRect();

  node.cache = {
    rect,
    freshUntil: Date.now() + 1000,
  };

  return rect;
}

export function distanceToRect(rect: DOMRect, x: number, y: number): number {
  const dx = x - Math.max(rect.left, Math.min(x, rect.right));
  const dy = y - Math.max(rect.top, Math.min(y, rect.bottom));
  return Math.sqrt(dx * dx + dy * dy);
}

export function getItemSourceFromScreenPos(x: number, y: number) {
  const MAX_DISTANCE = 8;
  const itemNodes = getItemNodes();

  const closest = itemNodes
    .map((slot) => {
      const rect = getNodeRect(slot.node.value);

      if (!rect) {
        return null;
      }

      return [slot.source, rect, distanceToRect(rect, x, y)] as const;
    })
    .filter(
      (entry): entry is NonNullable<typeof entry> => entry !== null && entry[2] <= MAX_DISTANCE,
    )
    .sort((a, b) => a[2] - b[2])[0];

  return closest
    ? closest[0]
    : ({
        origin: ItemSourceOrigin.Ground,
        originId: -1,
        inventorySlot: 0,
      } as const);
}

export function getItemNodeFromSource(source: ItemSource) {
  const itemNodes = getItemNodes();
  const slot = itemNodes.find((slot) => isSameItemSource(slot.source, source));
  return slot?.node.value;
}

export function getItemSourceScreenPosition(source: ItemSource) {
  const itemNodes = getItemNodes();
  const itemNode = itemNodes.find((slot) => isSameItemSource(slot.source, source));

  if (!itemNode) {
    return { x: 0, y: 0 };
  }

  const rect = getNodeRect(itemNode.node.value);

  if (!rect) {
    return { x: 0, y: 0 };
  }

  return { x: rect.x, y: rect.y };
}

export function getItemRelativeScreenPositionFromSource(source: ItemSource) {
  const node = getItemNodeFromSource(source);

  if (!node) {
    return { x: 0, y: 0 };
  }
  return { x: node.offsetLeft, y: node.offsetTop };
}
