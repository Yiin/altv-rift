import * as alt from "@altv/server";
import { PedFlags, PedType } from "@shared/modules/ped";
import { PedKey } from "@shared/modules/ped/list";
import { createStaticPed } from "./registry";

const peds = [
  {
    key: PedKey.CAL_BURNETT,
    flags: PedFlags.Peaceful,
    model: "CSB_MWeather",
    name: "Cal Burnett",
    pos: new alt.Vector3({ x: 4476.591, y: -4495.673, z: 4.1902 }),
  },
  {
    key: PedKey.DIEGO_MOREIRA,
    flags: PedFlags.Peaceful,
    model: "S_M_Y_Ranger_01",
    name: "Diego Moreira",
    pos: new alt.Vector3({ x: 5067.843, y: -4634.284, z: 2.4428231716156006 }),
  },
  {
    key: PedKey.FISHING_TUTOR,
    flags: PedFlags.Peaceful,
    model: "A_F_Y_Yoga_01",
    name: "Grace Porter",
    pos: new alt.Vector3({ x: 5106.049, y: -4625.984, z: 2.6494 }),
  },
  // {
  //   key: PedKey.MINING_TUTOR,
  //   flags: PedFlags.Peaceful,
  //   model: "S_M_Y_XMech_02_MP",
  //   name: "San Lee",
  //   pos: new alt.Vector3({  }),
  // },
  {
    key: PedKey.WOODCUTTING_TUTOR,
    flags: PedFlags.Peaceful,
    model: "CS_JimmyBoston",
    name: "Nathan Monahan",
    pos: new alt.Vector3({ x: 5472.264, y: -5852.646, z: 20.702 }),
    heading: 96.43,
  },
  {
    key: PedKey.CRAFTING_TUTOR,
    flags: PedFlags.Peaceful,
    model: "S_F_M_Autoshop_01",
    name: "Sara Matthews",
    pos: new alt.Vector3({ x: 5067.4, y: -4591.48, z: 2.856 }),
    heading: -19.58,
  },
].map(({ key, model, pos, heading, ...meta }) =>
  createStaticPed(key, { model, pos, heading: heading ?? 0 }, meta)
);
