import { Item, registerItem } from "@shared/modules/items";
import { makeItemKeys } from "@shared/modules/items/lib/make-item-keys";
import ARMOR_ITEMS from "./armor.json";

export const Armor = makeItemKeys<ArmorItemKey>()({
  FemaleTanUtilityVest: "DLC_MP_APA_F_SPECIAL2_1_0",
  FemaleKhakiUtilityVest: "DLC_MP_APA_F_SPECIAL2_1_1",
  FemaleBlackUtilityVest: "DLC_MP_APA_F_SPECIAL2_1_2",
  FemaleTanPocketUtilityVest: "DLC_MP_APA_F_SPECIAL2_2_0",
  FemaleKhakiPocketUtilityVest: "DLC_MP_APA_F_SPECIAL2_2_1",
  FemaleBlackPocketUtilityVest: "DLC_MP_APA_F_SPECIAL2_2_2",
  MaleTanUtilityVest: "DLC_MP_APA_M_SPECIAL2_1_0",
  MaleKhakiUtilityVest: "DLC_MP_APA_M_SPECIAL2_1_1",
  MaleBlackUtilityVest: "DLC_MP_APA_M_SPECIAL2_1_2",
  MaleTanPocketUtilityVest: "DLC_MP_APA_M_SPECIAL2_2_0",
  MaleKhakiPocketUtilityVest: "DLC_MP_APA_M_SPECIAL2_2_1",
  MaleBlackPocketUtilityVest: "DLC_MP_APA_M_SPECIAL2_2_2",
});

export type ArmorItemKey = Brand<string, "ArmorItemKey">;

export type ArmorItem = {
  key: ArmorItemKey;

  customName?: string | null;
};

export type ArmorItemInfo = {
  key: ArmorItemKey;
  ped: string;
  componentId: number;
  drawableId: number;
  textureId: number;
  name: string;
  price: number;
  restrictionTags: string[] | null;
};

export const armors: Record<ArmorItemKey, ArmorItemInfo> = ARMOR_ITEMS as Record<
  ArmorItemKey,
  ArmorItemInfo
>;

/**
 * Register all melee weapons.
 */
for (const [key, info] of Object.entries(armors)) {
  registerItem(key as ArmorItemKey, info);
}

/**
 * Type guards for melee weapons
 */
export function isItemKeyArmor(key: string): key is ArmorItemKey {
  return key in armors;
}

export function isItemArmor(item: Item): item is ArmorItem {
  return isItemKeyArmor(item.key);
}
