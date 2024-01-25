import { Equipment } from "@shared/modules/items";

/**
 * `ammo` is an equipment slot in the UI only, in the game
 * it is inside weapon data in weapon slot.
 */
export type EquipmentSlot = keyof Equipment | "ammo";
