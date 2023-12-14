import * as alt from "@altv/server";
import { createItem } from "@shared/modules/items";
import { isItemFirearmWeapon } from "@shared/modules/items/registry/weapons/firearm-weapon.items";
import { getInventoryItemInSlot } from "@shared/modules/inventory";
import { InGamePlayer } from "@/core/utility/assertions";
import { findItem } from "../api";

findItem.hook((itemSource, player) => {
  if (itemSource.origin !== "character") {
    return;
  }

  const sourcePlayer = alt.Player.all.find(
    (p): p is InGamePlayer => p.character?.id === itemSource.originId
  );

  if (!sourcePlayer) {
    return null;
  }

  if (player && sourcePlayer.id !== player.id) {
    return null;
  }

  if (itemSource.type === "equipment") {
    if (itemSource.equipmentSlot === "ammo") {
      const weapon = sourcePlayer.character.equipment.weapon;

      if (!weapon || !isItemFirearmWeapon(weapon)) {
        return null;
      }

      const ammo = weapon.ammo;

      if (!ammo) {
        return null;
      }

      return createItem(ammo.key, {
        amount: ammo.clip + ammo.rest,
      });
    }
    return sourcePlayer.character.equipment[itemSource.equipmentSlot] ?? null;
  }

  return (
    getInventoryItemInSlot(sourcePlayer.character.inventory, itemSource.inventorySlot)?.item ?? null
  );
});
