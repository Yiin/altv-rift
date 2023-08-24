import { Equipment } from "./prisma-overrides";

export type EquipmentSlot = keyof Equipment | "ammo";
