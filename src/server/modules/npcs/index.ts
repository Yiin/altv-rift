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
    pos: new alt.Vector3({
      x: 1960,
      y: 3848,
      z: 31.996417999267578,
    }),
  },
  {
    key: Npc.DIEGO_MOREIRA,
    type: PedType.STATIC,
    flags: NpcFlags.Peaceful,
    model: "S_M_Y_Ranger_01",
    name: "Diego Moreira",
    pos: new alt.Vector3({
      x: 1963,
      y: 3845,
      z: 31.996417999267578,
    }),
  },
].forEach(({ type, model, pos, ...meta }) => {
  createNpc(type, alt.hash(model), pos, 0, meta);
});
