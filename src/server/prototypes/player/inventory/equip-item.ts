import alt from "@altv/server";
import { EquipmentSlot, GroundItemSource, InventoryItemSource, ItemSourceOrigin } from "@shared/interfaces";
import { ServerEvents } from "@shared/events/server";
import { getItemEquipmentSlot, getItemInfoByKey, isItemAmmo, isItemKeyClothing, isMaleClothing, isUnisexClothing } from "@shared/modules/items";
import { isItemFirearmWeapon } from "@shared/modules/items/registry/weapons/firearm-weapon.items";
import { isItemFishBait } from "@shared/modules/items/registry/fish-bait.items";
import { InGamePlayer } from "@/core/utility/assertions";
import {
  addItemToInventory,
  findItem,
  findInventoryByItemSource,
  loadWeaponWithAmmo,
  removeItem,
} from "@/modules/items-manager";
import { useFishBaitOnFishingRod } from "@/modules/items-manager/items/fishing-rod";
import { emit } from "@/core/events/emit";
import { dropItemOnTheGround } from "@/modules/items-manager/dropped-items";

declare module "@altv/server" {
  export interface Player {
    equipItem(this: InGamePlayer, source: InventoryItemSource | GroundItemSource): boolean;
  }
}

/**
 * Tries to equip an item from a source.
 *
 * NOTE:
 *   This method doesn't check if the source is available for the player.
 */
alt.Player.prototype.equipItem = function (source) {
  const item = findItem(source, this);

  if (!item) {
    return false;
  }

  const equipmentSlot = isItemFishBait(item) ? "fishbait" : getItemEquipmentSlot(item);

  if (!equipmentSlot) {
    return false;
  }

  const inventory = source.origin === ItemSourceOrigin.Ground ? null : findInventoryByItemSource(source);

  if (source.origin !== ItemSourceOrigin.Ground && !inventory) {
    return false;
  }

  if (equipmentSlot === "ammo") {
    if (
      !loadWeaponWithAmmo(
        {
          equipmentSlot: EquipmentSlot.Weapon,
          origin: ItemSourceOrigin.PlayerEquipment,
          originId: this.character.id,
        },
        source
      )
    ) {
      return false;
    }
  } else if (equipmentSlot === "fishbait") {
    if (
      !useFishBaitOnFishingRod(
        {
          equipmentSlot: EquipmentSlot.Tool,
          origin: ItemSourceOrigin.PlayerEquipment,
          originId: this.character.id,
        },
        source
      )
    ) {
      return false;
    }
  }
  // Normal flow
  else {
    if (
      isItemKeyClothing(item.key)
      // If player gender doesn't match with clothing gender, don't equip
      && (
        (this.model === alt.hash("mp_f_freemode_01") && isMaleClothing(item.key) && !isUnisexClothing(item.key))
        ||
        (this.model === alt.hash("mp_m_freemode_01") && !isMaleClothing(item.key) && !isUnisexClothing(item.key))
      )
    ) {
      return false;
    }

    removeItem(source);

    const unequippedItem = this.character.equipment[equipmentSlot];

    if (unequippedItem) {
      if (inventory) {
        if (!addItemToInventory(inventory, unequippedItem)) {
          return false;
        }
      } else {
        dropItemOnTheGround(unequippedItem, this.pos);
      }
    }

    // @ts-expect-error item is guaranteed to be of correct type,
    // but TS is complaining that e.g. ClothingItem might be on weapon slot
    this.character.equipment[equipmentSlot] = item;

    if (equipmentSlot === "weapon" && isItemFirearmWeapon(item)) {
      // Auto-equip weapon ammo if needed
      if (!item.ammo) {
        const ammo = this.character.inventory.items.find(
          ({ item: ammo }) =>
            isItemAmmo(ammo) &&
            getItemInfoByKey(ammo.key).group === getItemInfoByKey(item.key).ammoGroup
        );

        if (ammo) {
          this.equipItem({
            inventorySlot: ammo.slot,
            origin: ItemSourceOrigin.PlayerInventory,
            originId: this.character.id,
          });
        }
      }
    }
  }

  emit(ServerEvents.FromServer.ITEM_EQUIP, this, item);
  return true;
};
function isUniSexClothing(key: import("@shared/modules/items").FirearmWeaponItemKey | import("@shared/modules/items").AmmoItemKey | import("@shared/modules/items").MeleeWeaponItemKey | import("@shared/modules/items").ThrowableWeaponItemKey | import("@shared/modules/items").AccessoryItemKey | import("@shared/modules/items").ArmorItemKey | import("@shared/modules/items").EarringsItemKey | import("@shared/modules/items").GlassesItemKey | import("@shared/modules/items").GlovesItemKey | import("@shared/modules/items").HeadwearItemKey | import("@shared/modules/items").LeftHandItemKey | import("@shared/modules/items").MaskItemKey | import("@shared/modules/items").PantsItemKey | import("@shared/modules/items").RightHandItemKey | import("@shared/modules/items").ShoesItemKey | import("@shared/modules/items").TopItemKey | import("@shared/modules/items").ConsumableItemKey | import("@shared/modules/items").FoodIngredientItemKey | import("@shared/modules/items").TreeLogItemKey | import("@shared/modules/items").WoodItemKey | import("@shared/modules/items").MetalItemKey | import("@shared/modules/items").SandItemKey | import("@shared/modules/items").FishBaitItemKey | import("@shared/modules/items").HatchetItemKey | import("@shared/modules/items").PickaxeItemKey | import("@shared/modules/items").FishingRodItemKey | import("@shared/modules/items").NoteItemKey) {
  throw new Error("Function not implemented.");
}

