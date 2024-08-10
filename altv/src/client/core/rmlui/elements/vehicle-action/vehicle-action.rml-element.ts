import alt from "@altv/client";
import game from "@altv/natives";
import { markRaw, ref, toRaw } from "vue";
import { ServerCall } from "@shared/calls/server";
import { VehicleBones } from "@/core/constants/vehicle-bones";
import { rpc } from "@/core/rpc";
import { everyFrame } from "../../renderer/hooks/every-frame";
import { br, div } from "../../renderer/rml-tags";
import { AnchorType } from "../../renderer/anchors";
import { registerElement } from "../../renderer/element-registry";
import { Icon } from "../../components/icon";
import { isTyping } from "@/core/user-interface/event-helpers";

const PARTS = [
  VehicleBones.BONNET,
  VehicleBones.BOOT,
  VehicleBones.HANDLE_DSIDE_F,
  VehicleBones.HANDLE_PSIDE_F,
  VehicleBones.HANDLE_DSIDE_R,
  VehicleBones.HANDLE_PSIDE_R,
] as const;

function getVehiclePartPosition(vehicle: alt.Vehicle, part: (typeof PARTS)[number]) {
  const boneIndex = game.getEntityBoneIndexByName(vehicle, part);

  if (boneIndex === -1) {
    return null;
  }

  switch (part) {
    case VehicleBones.BONNET: {
      const [, front] = game.getVehicleSize(vehicle);
      const { z } = game.getWorldPositionOfEntityBone(
        vehicle,
        game.getEntityBoneIndexByName(vehicle, VehicleBones.BONNET),
      );
      const { x, y } = game.getOffsetFromEntityInWorldCoords(vehicle, 0, front.y - 0.2, 0);
      return new alt.Vector3(x, y, z);
    }
    case VehicleBones.BOOT: {
      const [back] = game.getVehicleSize(vehicle);
      const { z } = game.getWorldPositionOfEntityBone(
        vehicle,
        game.getEntityBoneIndexByName(vehicle, VehicleBones.BOOT),
      );
      const { x, y } = game.getOffsetFromEntityInWorldCoords(vehicle, 0, back.y + 0.2, 0);
      return new alt.Vector3(x, y, z);
    }
    default:
      return game.getWorldPositionOfEntityBone(vehicle, boneIndex);
  }
}

const prevClosest = ref({
  part: null as null | (typeof PARTS)[number],
  position: null as null | alt.Vector3,
  vehicle: null as null | alt.Vehicle,
  dist: Infinity,
});

let newClosest = {
  part: null as null | (typeof PARTS)[number],
  position: null as null | alt.Vector3,
  vehicle: null as null | alt.Vehicle,
  dist: Infinity,
};

function getClosestPart(vehicle: alt.Vehicle) {
  let closestPart = null;
  let closestPosition = null;
  let closestDist = Infinity;

  for (const part of PARTS) {
    const position = getVehiclePartPosition(vehicle, part);

    if (!position) {
      continue;
    }

    const dist = alt.Player.local.pos.distanceTo(position);

    if (dist < closestDist) {
      closestDist = dist;
      closestPart = part;
      closestPosition = position;
    }
  }
  if (closestPart) {
    if (!newClosest.vehicle || newClosest.dist > closestDist) {
      newClosest = {
        part: closestPart,
        position: closestPosition,
        vehicle: markRaw(vehicle),
        dist: closestDist,
      };
    }
  }

  return {
    part: closestPart,
    position: closestPosition,
    dist: closestDist,
  };
}

alt.Timers.everyTick(() => {
  if (!alt.isGameFocused()) {
    return;
  }

  // Do not show actions if player's in a vehicle
  if (alt.Player.local.vehicle) {
    prevClosest.value = {
      part: null,
      position: null,
      vehicle: null,
      dist: Infinity,
    };
    return;
  }

  if (
    prevClosest.value.vehicle !== newClosest.vehicle ||
    prevClosest.value.part !== newClosest.part
  ) {
    prevClosest.value = newClosest;
  }
  newClosest = {
    part: null,
    position: null,
    vehicle: null,
    dist: Infinity,
  };
});

alt.Events.onKeyDown(({ key }) => {
  if (isTyping()) {
    return;
  }

  const { part, vehicle: closestVehicle } = prevClosest.value;

  if (key === alt.Enums.KeyCode.E && part && closestVehicle) {
    const door = (
      {
        [VehicleBones.BONNET]: 4,
        [VehicleBones.BOOT]: 5,
        [VehicleBones.HANDLE_DSIDE_F]: 0,
        [VehicleBones.HANDLE_PSIDE_F]: 1,
        [VehicleBones.HANDLE_DSIDE_R]: 2,
        [VehicleBones.HANDLE_PSIDE_R]: 3,
      } as const
    )[part];

    const shouldClose = game.getVehicleDoorAngleRatio(closestVehicle, door) !== 0;
    rpc.callServer(
      ServerCall.FromClient.TOGGLE_VEHICLE_DOOR,
      closestVehicle.remoteID,
      door,
      shouldClose,
    );
  }
});

registerElement({
  key: "vehicle-action",
  renderDistance: 2,
  anchorType: AnchorType.Vehicle,
  anchorPos(vehicle) {
    const { position } = getClosestPart(vehicle);

    return position ?? vehicle.pos;
  },
  render({ entity: vehicle }) {
    const { part, vehicle: closestVehicle } = prevClosest.value;

    if (closestVehicle?.remoteID !== vehicle.remoteID) {
      return null;
    }

    if (!part) {
      return null;
    }

    const boneIndex = game.getEntityBoneIndexByName(vehicle, part);

    if (boneIndex === -1) {
      return null;
    }

    return div(
      {
        class: "vehicle-action",
        style: {
          transform: everyFrame(({ pos }) => {
            const { x, y } = alt.worldToScreen(pos);

            return `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          }),
        },
      },
      [
        everyFrame(() => {
          const { part } = getClosestPart(vehicle);

          if (!part) {
            return null;
          }

          return Icon(
            (
              {
                [VehicleBones.BOOT]: "car-trunk",
                [VehicleBones.BONNET]: "car-bonnet",
                [VehicleBones.HANDLE_DSIDE_F]: "car-door",
                [VehicleBones.HANDLE_PSIDE_F]: "car-door",
                [VehicleBones.HANDLE_DSIDE_R]: "car-door",
                [VehicleBones.HANDLE_PSIDE_R]: "car-door",
              } as const
            )[part],
          );
        }),
        br([]),
        div({ class: "vehicle-action__text" }, [`[E]`]),
      ],
    );
  },
});
