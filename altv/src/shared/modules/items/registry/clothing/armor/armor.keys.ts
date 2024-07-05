import { makeKeys } from "@shared/utility/make-keys";

export type ArmorItemKey = Brand<string, "ArmorItemKey">;
export const Armor = makeKeys<ArmorItemKey>()({
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
