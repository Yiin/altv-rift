import alt from "alt-server";
import { ServerEvents } from "@shared/events/server";
import { isItemClothing, getItemInfoByKey, getItemEquipmentSlot } from "@shared/modules/items";
import { getTorsoForTop } from "@shared/modules/items/registry/clothing/get-correct-torso";

export function isComponentVariation(equipmentSlot: string) {
  return [
    "mask",
    "top",
    "armor",
    "accessory",
    "gloves",
    "pants",
    "backpack",
    "shoes",
    "phone",
    "tool",
  ].includes(equipmentSlot);
}

export function isProp(equipmentSlot: string) {
  return ["glasses", "headwear", "earrings", "lefthand", "righthand"].includes(equipmentSlot);
}

alt.on(ServerEvents.FromServer.EQUIP_ITEM, (player, item) => {
  if (!isItemClothing(item)) {
    return;
  }

  const equipmentSlot = getItemEquipmentSlot(item)!;
  const itemInfo = getItemInfoByKey(item.key);

  if (isComponentVariation(equipmentSlot)) {
    player.setClothes(itemInfo.componentId, itemInfo.drawableId, itemInfo.textureId);

    if (itemInfo.componentId === 11) {
      const torso = getTorsoForTop(player.model, itemInfo.drawableId, itemInfo.textureId);

      if (torso) {
        player.setClothes(3, torso.drawableId, torso.textureId);
      } else {
        player.setClothes(3, 14, 0);
      }
    }
  } else if (isProp(equipmentSlot)) {
    alt.log("Setting prop", itemInfo.componentId, itemInfo.drawableId, itemInfo.textureId);
    player.setProp(itemInfo.componentId, itemInfo.drawableId, itemInfo.textureId);
  }
});

alt.on(ServerEvents.FromServer.UNEQUIP_ITEM, (player, equipmentSlot) => {
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
