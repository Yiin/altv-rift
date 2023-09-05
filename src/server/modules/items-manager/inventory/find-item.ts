import alt from "alt-server";
import { createItem } from "@shared/modules/items";
import { InGamePlayer } from "@/utility/assertions";
import { findItem, getInventoryItemInSlot } from "../api";

findItem.hook((itemSource, player) => {
  if (itemSource.source !== "character") {
    return;
  }

  const sourcePlayer = alt.Player.all.find(
    (p): p is InGamePlayer => p.character?.id === itemSource.sourceId
  );

  if (!sourcePlayer) {
    return null;
  }

  if (player && sourcePlayer.id !== player.id) {
    return null;
  }

  if (itemSource.type === "equipment") {
    if (itemSource.equipmentSlot === "ammo") {
      const ammo = sourcePlayer.character.equipment.weapon?.FIREARM_WEAPON?.ammo;

      if (!ammo) {
        return null;
      }
      return createItem(ammo.key, {
        amount: ammo.clip.amount + ammo.rest.amount,
      });
    }
    return sourcePlayer.character.equipment[itemSource.equipmentSlot] ?? null;
  }

  return (
    getInventoryItemInSlot(sourcePlayer.character.inventory, itemSource.inventorySlot)?.item ?? null
  );
});
