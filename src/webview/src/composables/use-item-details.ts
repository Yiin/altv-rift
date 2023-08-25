import { computed, ComputedRef, ref, Ref, unref } from "vue";
import { ItemType } from "@prisma/client";
import { Item } from "@shared/interfaces";
import { getItemData, getItemDescription, getItemName, ItemKey } from "@shared/modules/items";

export const useItemDetails = (itemRef: Item | Ref<Item> | ComputedRef<Item>) => {
  const item = ref(itemRef);

  const name = computed(() => getItemName(item.value.key));
  const data = computed(() => getItemData(item.value));

  const customName = computed(() => {
    const data = getItemData(item.value);

    if (data && "customName" in data) {
      return data.customName;
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

  const equipedAmmo = computed(() => {
    if (item.value.type === ItemType.FIREARM_WEAPON) {
      const weapon = getItemData(item.value);
      if (!weapon) {
        return;
      }
      if (!weapon.ammo) {
        return;
      }
      return {
        key: weapon.ammo.key as ItemKey,
        clip: weapon.ammo.clip.amount,
        rest: weapon.ammo.rest.amount,
      };
    }
    return;
  });

  const details = computed(() => ({
    name: unref(name),
    customName: unref(customName),
    description: unref(description),
    image: unref(image),
    imageScale: unref(imageScale),
    equipedAmmo: unref(equipedAmmo),
    data: unref(data),
  }));

  return details;
};
