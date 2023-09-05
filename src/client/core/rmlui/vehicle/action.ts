import alt from "alt-client";
import game, { getVehicleSize } from "natives";
import { VehicleBones } from "@/constants/vehicle-bones";
import { br, div } from "../renderer/rml-tags";
import { AnchorType } from "../renderer/anchors";
import { registerElement } from "../renderer/element-registry";
import { everyFrame } from "../renderer/hooks/every-frame";
import { Icon } from "../components/icon/icon";

function getVehiclePartPosition(
  vehicle: alt.Vehicle,
  part: (typeof VehicleBones)[keyof typeof VehicleBones]
) {
  const boneIndex = game.getEntityBoneIndexByName(vehicle.scriptID, part);

  if (boneIndex === -1) {
    return null;
  }

  switch (part) {
    case VehicleBones.BONNET: {
      const [, , front] = getVehicleSize(vehicle.scriptID);
      const { z } = game.getWorldPositionOfEntityBone(
        vehicle.scriptID,
        game.getEntityBoneIndexByName(vehicle.scriptID, VehicleBones.BONNET)
      );
      const { x, y } = game.getOffsetFromEntityInWorldCoords(vehicle.scriptID, 0, front.y - 0.2, 0);
      return new alt.Vector3(x, y, z);
    }
    case VehicleBones.BOOT: {
      const [, back] = getVehicleSize(vehicle.scriptID);
      const { z } = game.getWorldPositionOfEntityBone(
        vehicle.scriptID,
        game.getEntityBoneIndexByName(vehicle.scriptID, VehicleBones.BOOT)
      );
      const { x, y } = game.getOffsetFromEntityInWorldCoords(vehicle.scriptID, 0, back.y + 0.2, 0);
      return new alt.Vector3(x, y, z);
    }
  }
  return null;
}

function getClosestPart(vehicle: alt.Vehicle) {
  let closestPart = null;
  let closestPosition = null;
  let closestDist = Infinity;

  for (const part of [VehicleBones.BONNET, VehicleBones.BOOT]) {
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

  return {
    part: closestPart,
    position: closestPosition,
  };
}

registerElement({
  key: "vehicle-action-boot",
  renderDistance: 5,
  focusable: true,
  anchorType: AnchorType.Vehicle,
  anchorPos(vehicle) {
    const { position } = getClosestPart(vehicle);

    return position ?? vehicle.pos;
  },
  render({ entity: vehicle }) {
    const controllableParts = [
      // VehicleBones.BONNET,
      // VehicleBones.HANDLE_DSIDE_F,
      // VehicleBones.HANDLE_PSIDE_F,
      // VehicleBones.HANDLE_DSIDE_R,
      // VehicleBones.HANDLE_PSIDE_R,
    ];

    const boneIndex = game.getEntityBoneIndexByName(vehicle.scriptID, VehicleBones.BOOT);

    if (boneIndex === -1) {
      return null;
    }

    return div(
      {
        className: "vehicle-action",
        style: {
          transform: everyFrame(({ pos }) => {
            const { x, y } = alt.worldToScreen(pos);

            return `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          }),
        },
      },
      [
        Icon("car-trunk"),
        br([]),
        div(
          {
            className: "vehicle-action__text",
            style: {
              transform: everyFrame(({ scale }) => `scale(${scale})`),
            },
          },
          [`[E]`]
        ),
      ]
    );
  },
});
