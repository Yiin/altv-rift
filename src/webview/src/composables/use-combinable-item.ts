import { ComputedRef, Ref, computed } from "vue";
import { InteractionType, isSameItemSource, useInventory, SlottedItem } from "@/store/inventory.store";
import { getCombineType, CombineType } from "@shared/modules/items";

export function useCombinableItem(item: Ref<SlottedItem | undefined> | ComputedRef<SlottedItem | undefined | null>) {
  const inventory = useInventory();

  const hoveredItem = computed(() => {
    const interaction = inventory.currentInteraction;

    const hoveredItem =
      (interaction.type === InteractionType.Hovering
        ? interaction.state.item
        : null);

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

    const [combineType, reverse] = getCombineType(item.value.item.key, hoveredItem.value.item.key);

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

    return inventory.items.some(
      ({ item: { key } }) => item.value && getCombineType(key, item.value.item.key)[0] !== CombineType.None
    );
  });

  return {
    combinableWithHoveredItem,
    combinableWithOtherItems,
  };
}
