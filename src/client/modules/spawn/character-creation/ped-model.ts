import alt from "@altv/client";

export function createPedModel(isMale: boolean, pos: alt.IVector3, heading: number) {
  const model = isMale ? "mp_m_freemode_01" : "mp_f_freemode_01";

  const ped = alt.LocalPed.create({
    model: alt.hash(model),
    pos: new alt.Vector3(pos),
    heading,
    dimension: alt.Player.local.dimension,
    useStreaming: false,
  });

  return ped;
}
