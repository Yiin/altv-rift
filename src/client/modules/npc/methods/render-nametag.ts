import alt from "alt-client";
import native from "natives";
import { drawBar, drawBarBackground } from "@/utility/drawings";
import { isPedUnderVehicle } from "@/utility/ped";
import { StreamedNpc } from "../ped";
import { COMMON_SCENARIOS } from "../constants/scenarios";

export function renderNametag(this: StreamedNpc) {
  const { x, y, z } = native.getEntityCoords(this.ped, false);
  const gameplayCamPos = native.getGameplayCamCoord();
  const distance = native.getDistanceBetweenCoords(
    gameplayCamPos.x,
    gameplayCamPos.y,
    gameplayCamPos.z,
    x,
    y,
    z,
    true
  );

  if (distance > 50) {
    return;
  }
  const vector = native.getEntityVelocity(this.ped);
  const frameTime = native.getFrameTime();
  const scale = Math.max(0.15, Math.min(0.6, (1 / distance) * 3));
  const fontSize = scale;
  const pos = { ...native.getPedBoneCoords(this.ped, 12844, 0, 0, 0) };
  pos.z += 2;
  native.setDrawOrigin(
    pos.x + vector.x * frameTime,
    pos.y + vector.y * frameTime,
    pos.z + vector.z * frameTime,
    false
  );

  native.beginTextCommandDisplayText("STRING");
  native.setTextFont(4);
  native.setTextScale(fontSize, fontSize);
  native.setTextProportional(true);
  native.setTextCentre(true);
  native.setTextColour(255, 255, 255, 255);
  native.setTextOutline();

  native.addTextComponentSubstringPlayerName(
    [
      `~n~~n~ID: ${this.ped}`,
      `Health: ${this.npc.health.toFixed(2)}`,
      `HP: ${native.getEntityHealth(this.ped)}`,
      this.netOwned && `Net Owned`,
      `(${this.npc.position.x.toFixed(2)}, ${this.npc.position.y.toFixed(
        2
      )}, ${this.npc.position.z.toFixed(2)})`,
      this.runningTask && `Task: ${this.runningTask.type}`,
    ]
      .filter(Boolean)
      .join(", ")
  );
  drawBarBackground(100, 20, 1, 0.25, 139, 0, 0, 255);
  drawBar(
    Math.round((this.npc.health / 1000) * 100),
    20,
    1,
    0.25,
    255,
    0,
    0,
    255
  );
  native.endTextCommandDisplayText(0, 0, 0);

  alt.Utils.drawText3dThisFrame(
    [
      native.isPedRagdoll(this.ped) && "Ragdoll",
      native.isPedRunningRagdollTask(this.ped) && "Running ragdoll task",
    ].join(", "),
    // Object.entries(PED_TASK)
    //   .filter(
    //     ([, value]) =>
    //       typeof value === "number" && native.getIsTaskActive(this.ped, value)
    //   )
    //   .map(([key]) => key)
    //   .join(", "),
    pos
  );
}
