import { computed, ComputedRef, ref, Ref, unref } from "vue";
import { ItemType } from "@prisma/client";
import { ItemData } from "@shared/interfaces";
import {
  getItemData,
  getItemDescription,
  getItemName,
  isItemWeapon,
  ItemKey,
} from "@shared/modules/items";
import { isItemConsumable } from "@shared/modules/items/consumables";

export const useItemDetails = (
  itemRef: ItemData | Ref<ItemData> | ComputedRef<ItemData>
) => {
  const item = ref(itemRef);

  const name = computed(() => getItemName(item.value.key));
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
    if (item.value.type === ItemType.WEAPON) {
      const weapon = getItemData(item.value);
      if (!weapon) {
        return;
      }
      if (!weapon.ammo) {
        return;
      }
      return {
        key: weapon.ammo.key as ItemKey,
        amount: weapon.ammo.data.amount,
      };
    }
  });

  const details = computed(() => ({
    name: unref(name),
    customName: unref(customName),
    description: unref(description),
    image: unref(image),
    imageScale: unref(imageScale),
    equipedAmmo: unref(equipedAmmo),
  }));

  return details;
};
