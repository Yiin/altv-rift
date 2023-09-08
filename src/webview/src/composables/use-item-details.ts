import { computed, ComputedRef, ref, Ref, unref } from "vue";

import { getItemDescription, getItemName, Item } from "@shared/modules/items";

export const useItemDetails = (itemRef: Item | Ref<Item> | ComputedRef<Item>) => {
  const item = ref(itemRef);

  const name = computed(() => getItemName(item.value.key));

  const customName = computed(() => {
    if (item && "customName" in item) {
      return item.customName;
    }
    return null;
  });
  const description = computed(() => getItemDescription(item.value.key));
  const image = computed(() => `./assets/items/${item.value.key}.png`);
  const imageScale = computed(
    () =>
      ((
        {
          snowball: "40%",
        } as Record<string, string>
      )[item.value.key] || "90%")
  );

  const details = computed(() => ({
    name: unref(name),
    customName: unref(customName),
    description: unref(description),
    image: unref(image),
    imageScale: unref(imageScale),
  }));

  return details;
};
