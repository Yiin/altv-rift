import alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";
import {
  isItemClothing,
  getItemInfoByKey,
  getItemEquipmentSlot,
  isFemaleClothing,
  ClothingItemKey,
  isUnisexClothing,
  isMaleClothing,
  isComponentVariation,
  TopItemInfo,
} from "@shared/modules/items";
import { getTorsoForTop } from "@shared/modules/items/registry/clothing/get-correct-torso";
import { on } from "@/core/events/emit";
import { getDefaultClothing } from "@shared/modules/items/registry/clothing/get-default-clothing";

function applyGenderClothing(player: alt.Player, key: ClothingItemKey): ClothingItemKey {
  if (player.model === alt.hash("mp_f_freemode_01")) {
    if (isFemaleClothing(key)) {
      return key;
    }
    if (isUnisexClothing(key)) {
      return key.replace("f_", "m_") as ClothingItemKey;
    }
  } else {
    if (isMaleClothing(key)) {
      return key;
    }
    if (isUnisexClothing(key)) {
      return key.replace("m_", "f_") as ClothingItemKey;
    }
  }
  return key;
}

export function isProp(equipmentSlot: string): boolean {
  return ["glasses", "headwear", "earrings", "lefthand", "righthand"].includes(equipmentSlot);
}

on(ServerEvents.FromServer.ITEM_EQUIP, (player, item) => {
  if (!isItemClothing(item)) {
    return;
  }

  const equipmentSlot = getItemEquipmentSlot(item)!;
  const itemInfo = getItemInfoByKey(applyGenderClothing(player, item.key));

  if (isComponentVariation(equipmentSlot)) {
    console.log(
      `setDlcClothes(${itemInfo.componentId}, ${itemInfo.dlcDrawableId}, ${itemInfo.textureId}, 2, alt.hash(${itemInfo.dlc}))`,
    );
    player.setDlcClothes(
      itemInfo.componentId,
      itemInfo.dlcDrawableId,
      itemInfo.textureId,
      2,
      alt.hash(itemInfo.dlc),
    );

    if (itemInfo.componentId === 11) {
      console.log(`resetClothes(3)`);
      player.resetClothes(3);
    }
  } else if (isProp(equipmentSlot)) {
    player.setDlcProp(
      itemInfo.componentId,
      itemInfo.dlcDrawableId,
      itemInfo.textureId,
      alt.hash(itemInfo.dlc),
    );
  }
});

on(ServerEvents.FromServer.ITEM_UNEQUIP, (player, equipmentSlot) => {
  if (isComponentVariation(equipmentSlot)) {
    const componentId =
      {
        mask: 1,
        top: 11,
        armor: 9,
        accessory: 7,
        gloves: 3,
        pants: 4,
        backpack: 5,
        shoes: 6,
      }[equipmentSlot as string] ?? -1;

    if (componentId !== -1) {
      player.resetClothes(componentId);
    }
    return;
  }

  if (isProp(equipmentSlot)) {
    const componentId =
      {
        glasses: 1,
        headwear: 0,
        earrings: 2,
        lefthand: 6,
        righthand: 7,
      }[equipmentSlot as string] ?? -1;

    if (componentId !== -1) {
      player.clearProp(componentId);
    }
  }
});
