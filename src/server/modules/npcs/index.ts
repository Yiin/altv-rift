import * as alt from "@altv/server";
import { NpcFlags, PedType } from "@shared/modules/npc";
import { Npc } from "@shared/modules/npc/list";
import { createNpc } from "./registry";

[
  {
    key: Npc.CAL_BURNETT,
    type: PedType.STATIC,
    flags: NpcFlags.Peaceful,
    model: "CSB_MWeather",
    name: "Cal Burnett",
    pos: new alt.Vector3({ x: 4476.591, y: -4495.673, z: 4.1902 }),
  },
  {
    key: Npc.DIEGO_MOREIRA,
    type: PedType.STATIC,
    flags: NpcFlags.Peaceful,
    model: "S_M_Y_Ranger_01",
    name: "Diego Moreira",
    pos: new alt.Vector3({ x: 5067.843, y: -4634.284, z: 2.4321 }),
  },
  {
    key: Npc.FISHING_TUTOR,
    type: PedType.STATIC,
    flags: NpcFlags.Peaceful,
    model: "A_F_Y_Yoga_01",
    name: "Grace Porter",
    pos: new alt.Vector3({ x: 5106.049, y: -4625.984, z: 2.6494 }),
  },
  // {
  //   key: Npc.MINING_TUTOR,
  //   type: PedType.STATIC,
  //   flags: NpcFlags.Peaceful,
  //   model: "S_M_Y_XMech_02_MP",
  //   name: "San Lee",
  //   pos: new alt.Vector3({  }),
  // },
  {
    key: Npc.WOODCUTTING_TUTOR,
    type: PedType.STATIC,
    flags: NpcFlags.Peaceful,
    model: "CS_JimmyBoston",
    name: "Nathan Monahan",
    pos: new alt.Vector3({ x: 5472.264, y: -5852.646, z: 20.702 }),
    rot: 96.43,
  },
  {
    key: Npc.CRAFTING_TUTOR,
    type: PedType.STATIC,
    flags: NpcFlags.Peaceful,
    model: "S_F_M_Autoshop_01",
    name: "Sara Matthews",
    pos: new alt.Vector3({ x: 5067.4, y: -4591.48, z: 2.856 }),
    rot: -19.58,
  },
].forEach(({ type, model, pos, rot, ...meta }) => {
  createNpc(type, alt.hash(model), pos, rot ?? 0, meta);
});
