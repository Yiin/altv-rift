import alt from "alt-server";
import { AmmoItem, EquipedAmmo, Equipment, EquipmentSlot, InventoryItem } from "@shared/interfaces";
import { InGamePlayer } from "@/utility/assertions";

declare module "alt-server" {
    export interface Player {
        getEquipmentItemInSlot(this: InGamePlayer, equipmentSlot: EquipmentSlot): NonNullable<typeof equipmentSlot extends 'ammo' ? EquipedAmmo : Equipment[Exclude<typeof equipmentSlot, 'ammo'>]> | null;
    }
}

alt.Player.prototype.getEquipmentItemInSlot = function (equipmentSlot) {
    if (equipmentSlot === 'ammo') {
        return this.store.character?.equipment.weapon?.FIREARM_WEAPON?.ammo ?? null;
    }
    return this.store.character?.equipment[equipmentSlot] ?? null;
};
