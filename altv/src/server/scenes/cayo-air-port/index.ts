import { createStaticPed } from "@/modules/peds/peds.registry";
import alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";
import { PedFlags } from "@shared/modules/ped";
import { PedKey } from "@shared/modules/ped/list";

const ratbikes = [
  {
    x: 4453.9384765625,
    y: -4468.931640625,
    z: 3.7861328125,
    rot: {
      x: -0.14125892519950867,
      y: -0.04815739020705223,
      z: -1.404533863067627,
    },
  },
  {
    x: 4453.66162109375,
    y: -4470.77783203125,
    z: 3.7861328125,
    rot: {
      x: -0.13660040497779846,
      y: -0.0076276580803096294,
      z: -1.6886130571365356,
    },
  },
  {
    x: 4455.0595703125,
    y: -4466.61083984375,
    z: 3.7861328125,
    rot: {
      x: -0.0795850083231926,
      y: -0.13555096089839935,
      z: -0.6799421906471252,
    },
  },
  {
    x: 4454.0966796875,
    y: -4465.89892578125,
    z: 3.7861328125,
    rot: {
      x: -0.09737370163202286,
      y: -0.09127698093652725,
      z: -0.9920035004615784,
    },
  },
  {
    x: 4453.490234375,
    y: -4464.35595703125,
    z: 3.7861328125,
    rot: {
      x: -0.13779506087303162,
      y: -0.10241547226905823,
      z: -1.0774649381637573,
    },
  },
].map(({ rot, ...pos }) => {
  const ratbike = alt.Vehicle.create({
    model: "ratbike",
    pos,
    rot,
  });
  ratbike.frozen = true;
});

const seller = createStaticPed({
  model: "CSB_Ramp_hic",
  pos: { x: 4451.68359375, y: -4468.0087890625, z: 4.3253173828125 },
  heading: 2.12737774848938,
  name: "John Wick",
  flags: PedFlags.Peaceful,
  key: PedKey.JOHN_WICK,
});

const assignedRatbikes = new Map<alt.Player, alt.Vehicle>();

alt.Events.onPlayer(ServerEvents.FromClient.GET_RATBIKE, (player) => {
  const existingRatBike = assignedRatbikes.get(player);

  if (existingRatBike) {
    if (player.vehicle === existingRatBike) {
      return;
    }
    existingRatBike.destroy();
  }

  const ratbike = alt.Vehicle.create({
    model: "ratbike",
    pos: player.pos,
    rot: player.rot,
  });

  assignedRatbikes.set(player, ratbike);

  player.setIntoVehicle(ratbike, 1);
});
