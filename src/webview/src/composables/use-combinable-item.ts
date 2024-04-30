import { type ComputedRef, type Ref, computed } from "vue";
import { getCombineType, CombineType } from "@shared/modules/items";
import {
  InteractionType,
  isSameItemSource,
  useInventory,
  type SlottedItem,
} from "@/store/inventory.store";

export function useCombinableItem(
  item: Ref<SlottedItem | undefined> | ComputedRef<SlottedItem | undefined | null>,
) {
  const { items, currentInteraction } = useInventory();

  const hoveredItem = computed(() => {
    const interaction = currentInteraction.value;

    const hoveredItem =
      interaction.type === InteractionType.Hovering ? interaction.state.item : null;

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

    return items.value.some(
      ({ item: { key } }) =>
        item.value && getCombineType(key, item.value.item.key)[0] !== CombineType.None,
    );
  });

  return {
    combinableWithHoveredItem,
    combinableWithOtherItems,
  };
}
