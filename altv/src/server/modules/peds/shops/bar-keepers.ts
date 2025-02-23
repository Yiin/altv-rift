import alt from "@altv/server";
import { PedFlags } from "@shared/modules/ped";
import { createStaticPed } from "../lib";

const positions: { pos: alt.IVector3; heading: number }[] = [
  {
    pos: { x: 1984.0322265625, y: 3054.593017578125, z: 47.20948028564453 },
    heading: -1.75125,
  },
];

for (const { pos, heading } of positions) {
  createStaticPed({
    model: "S_M_M_Migrant_01", //"U_M_Y_BurgerDrug_01",
    pos,
    heading,
    flags: PedFlags.Peaceful | PedFlags.ShopKeeper,
  });
}
