import { type ComputedRef, type Ref, computed } from "vue";
import { getCombineType, CombineType } from "@shared/modules/items";
import {
  InventoryInteractionType,
  isSameItemSource,
  type SlottedItem,
  getCurrentInventoryInteraction,
  getItems,
} from "@/store/inventory";

export function useCombinableItem(
  item: Ref<SlottedItem | undefined> | ComputedRef<SlottedItem | undefined | null>,
) {
  const currentInteraction = getCurrentInventoryInteraction();

  const hoveredItem = computed(() => {
    const hoveredItem =
      currentInteraction.type === InventoryInteractionType.Hovering
        ? currentInteraction.state.item
        : null;

    return hoveredItem;
  });

  const combinableWithHoveredItem = computed(() => {
    if (!item.value) {
      return false;
    }

    if (!hoveredItem.value) {
      return false;
    }

    if (isSameItemSource(hoveredItem.value.source, item.value.source)) {
      return false;
    }

    const [combineType] = getCombineType(item.value.item.key, hoveredItem.value.item.key);

    return combineType !== CombineType.None;
  });

  const combinableWithOtherItems = computed(() => {
    if (!item.value) {
      return false;
    }

    if (!hoveredItem.value) {
      return false;
    }

    if (!isSameItemSource(hoveredItem.value.source, item.value.source)) {
      return false;
    }

    return getItems().some(
      ({ item: { key } }) =>
        item.value && getCombineType(key, item.value.item.key)[0] !== CombineType.None,
    );
  });

  return {
    combinableWithHoveredItem,
    combinableWithOtherItems,
  };
}
