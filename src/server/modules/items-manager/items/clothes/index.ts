import alt from "alt-server";
import { ServerEvents } from "@shared/events/server";
import { isItemClothing, getItemInfoByKey } from "@shared/modules/items";

alt.on(ServerEvents.FromServer.EQUIP_ITEM, (player, item) => {
  if (!isItemClothing(item)) {
    return;
  }

  const itemInfo = getItemInfoByKey(item.key);

  player.setClothes(itemInfo.componentId, itemInfo.drawableId, itemInfo.textureId);
});

alt.on(ServerEvents.FromServer.UNEQUIP_ITEM, (player, equipmentSlot) => {
  const isComponentVariation = [
    "mask",
    "top",
    "shirt",
    "armor",
    "accessory",
    "gloves",
    "pants",
    "backpack",
    "shoes",
    "phone",
    "tool",
  ].includes(equipmentSlot);

  if (isComponentVariation) {
    const componentId =
      {
        mask: 1,
        top: 11,
        shirt: 8,
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

  const isProp = ["glasses", "headwear", "earrings", "lefthand", "righthand"].includes(
    equipmentSlot
  );

  if (isProp) {
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
