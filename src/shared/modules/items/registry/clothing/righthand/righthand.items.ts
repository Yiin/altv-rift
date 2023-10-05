import { Item, registerItem } from "@shared/modules/items";
import { makeKeys } from "@shared/utility/make-keys";
import RIGHTHAND_ITEMS from "./righthand.json";
import { RightHandMap } from "./righthand-map";

export const RightHand = makeKeys<RightHandItemKey>()({
  MaleAquaHippyBracelet: "DLC_MP_SUM23_M_PRIGHT_WRIST_0_0",
  MaleMossHippyBracelet: "DLC_MP_SUM23_M_PRIGHT_WRIST_0_1",
  MaleSandHippyBracelet: "DLC_MP_SUM23_M_PRIGHT_WRIST_0_2",
  MaleStoneHippyBracelet: "DLC_MP_SUM23_M_PRIGHT_WRIST_0_3",
  MaleBrightHippyBracelet: "DLC_MP_SUM23_M_PRIGHT_WRIST_0_4",
  MaleRustHippyBracelet: "DLC_MP_SUM23_M_PRIGHT_WRIST_0_5",
  FemaleAquaHippyBracelet: "DLC_MP_SUM23_F_PRIGHT_WRIST_0_0",
  FemaleMossHippyBracelet: "DLC_MP_SUM23_F_PRIGHT_WRIST_0_1",
  FemaleSandHippyBracelet: "DLC_MP_SUM23_F_PRIGHT_WRIST_0_2",
  FemaleStoneHippyBracelet: "DLC_MP_SUM23_F_PRIGHT_WRIST_0_3",
  FemaleBrightHippyBracelet: "DLC_MP_SUM23_F_PRIGHT_WRIST_0_4",
  FemaleRustHippyBracelet: "DLC_MP_SUM23_F_PRIGHT_WRIST_0_5",
  FemaleSilverChunkyBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_0_0",
  FemaleMonoChunkyBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_0_1",
  FemaleGoldChunkyBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_0_2",
  FemaleRoseChunkyBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_0_3",
  FemaleCopperChunkyBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_0_4",
  FemaleSilverChainBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_1_0",
  FemaleMonoChainBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_1_1",
  FemaleGoldChainBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_1_2",
  FemaleRoseChainBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_1_3",
  FemaleCopperChainBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_1_4",
  FemaleBlackWovenBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_2_0",
  FemaleDarkGrayWovenBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_2_1",
  FemaleChestnutWovenBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_2_10",
  FemaleDarkNutWovenBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_2_11",
  FemaleBlueWovenBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_2_12",
  FemaleLightBlueWovenBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_2_13",
  FemaleLightGrayWovenBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_2_2",
  FemaleWhiteWovenBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_2_3",
  FemaleOxBloodWovenBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_2_4",
  FemaleCrimsonWovenBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_2_5",
  FemaleGreenWovenBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_2_6",
  FemaleRedWovenBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_2_7",
  FemaleOrangeWovenBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_2_8",
  FemaleMustardWovenBracelet: "DLC_MP_X22_F_PRIGHT_WRIST_2_9",
  MaleSilverChunkyBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_0_0",
  MaleMonoChunkyBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_0_1",
  MaleGoldChunkyBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_0_2",
  MaleRoseChunkyBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_0_3",
  MaleCopperChunkyBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_0_4",
  MaleSilverChainBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_1_0",
  MaleMonoChainBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_1_1",
  MaleGoldChainBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_1_2",
  MaleRoseChainBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_1_3",
  MaleCopperChainBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_1_4",
  MaleBlackWovenBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_2_0",
  MaleDarkGrayWovenBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_2_1",
  MaleChestnutWovenBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_2_10",
  MaleDarkNutWovenBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_2_11",
  MaleBlueWovenBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_2_12",
  MaleLightBlueWovenBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_2_13",
  MaleLightGrayWovenBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_2_2",
  MaleWhiteWovenBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_2_3",
  MaleOxBloodWovenBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_2_4",
  MaleCrimsonWovenBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_2_5",
  MaleGreenWovenBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_2_6",
  MaleRedWovenBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_2_7",
  MaleOrangeWovenBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_2_8",
  MaleMustardWovenBracelet: "DLC_MP_X22_M_PRIGHT_WRIST_2_9",
  FemaleBlueBanglesR: "DLC_MP_H4_F_PRIGHT_WRIST_0_0",
  FemaleRedBanglesR: "DLC_MP_H4_F_PRIGHT_WRIST_0_1",
  FemaleSunsetBanglesR: "DLC_MP_H4_F_PRIGHT_WRIST_0_10",
  FemaleTropicalBanglesR: "DLC_MP_H4_F_PRIGHT_WRIST_0_11",
  FemalePinkBanglesR: "DLC_MP_H4_F_PRIGHT_WRIST_0_2",
  FemaleYellowBanglesR: "DLC_MP_H4_F_PRIGHT_WRIST_0_3",
  FemaleOrangeBanglesR: "DLC_MP_H4_F_PRIGHT_WRIST_0_4",
  FemaleGreenBanglesR: "DLC_MP_H4_F_PRIGHT_WRIST_0_5",
  FemaleRedBlueBanglesR: "DLC_MP_H4_F_PRIGHT_WRIST_0_6",
  FemaleYellowOrangeBanglesR: "DLC_MP_H4_F_PRIGHT_WRIST_0_7",
  FemaleGreenPinkBanglesR: "DLC_MP_H4_F_PRIGHT_WRIST_0_8",
  FemaleRainbowBanglesR: "DLC_MP_H4_F_PRIGHT_WRIST_0_9",
  MaleBlueBanglesR: "DLC_MP_H4_M_PRIGHT_WRIST_0_0",
  MaleRedBanglesR: "DLC_MP_H4_M_PRIGHT_WRIST_0_1",
  MaleSunsetBanglesR: "DLC_MP_H4_M_PRIGHT_WRIST_0_10",
  MaleTropicalBanglesR: "DLC_MP_H4_M_PRIGHT_WRIST_0_11",
  MalePinkBanglesR: "DLC_MP_H4_M_PRIGHT_WRIST_0_2",
  MaleYellowBanglesR: "DLC_MP_H4_M_PRIGHT_WRIST_0_3",
  MaleOrangeBanglesR: "DLC_MP_H4_M_PRIGHT_WRIST_0_4",
  MaleGreenBanglesR: "DLC_MP_H4_M_PRIGHT_WRIST_0_5",
  MaleRedBlueBanglesR: "DLC_MP_H4_M_PRIGHT_WRIST_0_6",
  MaleYellowOrangeBanglesR: "DLC_MP_H4_M_PRIGHT_WRIST_0_7",
  MaleGreenPinkBanglesR: "DLC_MP_H4_M_PRIGHT_WRIST_0_8",
  MaleRainbowBanglesR: "DLC_MP_H4_M_PRIGHT_WRIST_0_9",
  MaleLightWristChainR: "DLC_MP_BIKER_M_PRIGHT_WRIST_0_0",
  MaleChunkyWristChainR: "DLC_MP_BIKER_M_PRIGHT_WRIST_1_0",
  MaleSquareWristChainR: "DLC_MP_BIKER_M_PRIGHT_WRIST_2_0",
  MaleSkullWristChainR: "DLC_MP_BIKER_M_PRIGHT_WRIST_3_0",
  MaleTreadWristChainR: "DLC_MP_BIKER_M_PRIGHT_WRIST_4_0",
  MaleGearWristChainsR: "DLC_MP_BIKER_M_PRIGHT_WRIST_5_0",
  MaleSpikedGauntletR: "DLC_MP_BIKER_M_PRIGHT_WRIST_6_0",
  MaleBlackGauntletR: "DLC_MP_BIKER_M_PRIGHT_WRIST_7_0",
  MaleChocolateGauntletR: "DLC_MP_BIKER_M_PRIGHT_WRIST_7_1",
  MaleTanGauntletR: "DLC_MP_BIKER_M_PRIGHT_WRIST_7_2",
  MaleOxBloodGauntletR: "DLC_MP_BIKER_M_PRIGHT_WRIST_7_3",
  FemaleLightWristChainR: "DLC_MP_BIKER_F_PRIGHT_WRIST_0_0",
  FemaleChunkyWristChainR: "DLC_MP_BIKER_F_PRIGHT_WRIST_1_0",
  FemaleSquareWristChainR: "DLC_MP_BIKER_F_PRIGHT_WRIST_2_0",
  FemaleSkullWristChainR: "DLC_MP_BIKER_F_PRIGHT_WRIST_3_0",
  FemaleTreadWristChainR: "DLC_MP_BIKER_F_PRIGHT_WRIST_4_0",
  FemaleGearWristChainsR: "DLC_MP_BIKER_F_PRIGHT_WRIST_5_0",
  FemaleSpikedGauntletR: "DLC_MP_BIKER_F_PRIGHT_WRIST_6_0",
  FemaleBlackGauntletR: "DLC_MP_BIKER_F_PRIGHT_WRIST_7_0",
  FemaleChocolateGauntletR: "DLC_MP_BIKER_F_PRIGHT_WRIST_7_1",
  FemaleTanGauntletR: "DLC_MP_BIKER_F_PRIGHT_WRIST_7_2",
  FemaleOxBloodGauntletR: "DLC_MP_BIKER_F_PRIGHT_WRIST_7_3",
  FemaleGoldMeanderBracelet: "DLC_MP_SUM2_F_PRIGHT_WRIST_0_0",
  FemaleSilverMeanderBracelet: "DLC_MP_SUM2_F_PRIGHT_WRIST_0_1",
  FemaleRoseMeanderBracelet: "DLC_MP_SUM2_F_PRIGHT_WRIST_0_2",
  FemaleGoldSnakeCuff: "DLC_MP_LUXE2_F_PRIGHT_WRIST_0_0",
  FemaleGoldDiamondCuff: "DLC_MP_LUXE2_F_PRIGHT_WRIST_1_0",
  FemaleGoldPlainCuff: "DLC_MP_LUXE2_F_PRIGHT_WRIST_2_0",
  FemaleGoldLeChienCuff: "DLC_MP_LUXE2_F_PRIGHT_WRIST_3_0",
  FemaleGoldDetailCuff: "DLC_MP_LUXE2_F_PRIGHT_WRIST_4_0",
  FemaleGoldSwirlCuff: "DLC_MP_LUXE2_F_PRIGHT_WRIST_5_0",
  FemaleGoldTexturedCuff: "DLC_MP_LUXE2_F_PRIGHT_WRIST_6_0",
  MaleGoldMeanderBracelet: "DLC_MP_SUM2_M_PRIGHT_WRIST_0_0",
  MaleSilverMeanderBracelet: "DLC_MP_SUM2_M_PRIGHT_WRIST_0_1",
  MaleRoseMeanderBracelet: "DLC_MP_SUM2_M_PRIGHT_WRIST_0_2",
});

export type RightHandItemKey = Brand<string, "RightHandItemKey">;

export type RightHandItem = {
  key: RightHandItemKey;

  customName?: string | null;
};

export type RightHandItemInfo = {
  key: RightHandItemKey;
  ped: string;
  componentId: number;
  drawableId: number;
  textureId: number;
  name: string;
  price: number;
  restrictionTags: string[] | null;
};

export const righthand = Object.values(RIGHTHAND_ITEMS) as any as RightHandItemInfo[];

/**
 * Register all right hand items.
 */
// console.log("Registering right hand items...");
for (const info of righthand) {
  registerItem(info);
}
// console.log(`Registered ${Object.keys(righthand).length} right hand items.`);

/**
 * Type guards for right hand items
 */
export function isItemKeyRightHand(key: string): key is RightHandItemKey {
  return righthand.some((info) => info.key === key);
}

export function isItemRightHand(item: Item): item is RightHandItem {
  return isItemKeyRightHand(item.key);
}
