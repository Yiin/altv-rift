import { Equipment } from "@shared/modules/items";

export type EquipmentSlot = keyof Equipment | "ammo";
