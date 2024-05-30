import { computed, type ComputedRef, ref, type Ref, unref } from "vue";
import { getItemDescription, getItemName, type Item } from "@shared/modules/items";

export const useItemDetails = (itemRef: Item | Ref<Item> | ComputedRef<Item>) => {
  const item = ref(itemRef);

  const name = computed(() => getItemName(item.value.key));

  const customName = computed(() => {
    if (item.value && "customName" in item.value) {
      return item.value.customName;
    }
    return null;
  });
  const description = computed(() => getItemDescription(item.value.key));
  const image = computed(() => `./assets/items/${item.value.key}.png`);
  const imageScale = computed(
    () =>
      (
        ({
          snowball: "40%",
        }) as Record<string, string>
      )[item.value.key] || "90%",
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
