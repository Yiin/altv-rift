import alt from "alt-client";
import game from "natives";
import { drawBar, drawBarBackground } from "@/utility/drawings";
import { StreamedNpc } from "../ped";

export function _renderNametag(this: StreamedNpc) {
  const { x, y, z } = game.getEntityCoords(this.ped, false);
  const gameplayCamPos = game.getGameplayCamCoord();
  const distance = game.getDistanceBetweenCoords(
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
  const vector = game.getEntityVelocity(this.ped);
  const frameTime = game.getFrameTime();
  const scale = Math.max(0.15, Math.min(0.6, (1 / distance) * 3));
  const fontSize = scale;
  const pos = { ...game.getPedBoneCoords(this.ped, 12844, 0, 0, 0) };
  pos.z += 2;
  game.setDrawOrigin(
    pos.x + vector.x * frameTime,
    pos.y + vector.y * frameTime,
    pos.z + vector.z * frameTime,
    false
  );

  game.beginTextCommandDisplayText("STRING");
  game.setTextFont(4);
  game.setTextScale(fontSize, fontSize);
  game.setTextProportional(true);
  game.setTextCentre(true);
  game.setTextColour(255, 255, 255, 255);
  game.setTextOutline();

  game.addTextComponentSubstringPlayerName(
    [
      `~n~~n~ID: ${this.ped}`,
      `Health: ${this.npc.health.toFixed(2)}`,
      `HP: ${game.getEntityHealth(this.ped)}`,
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
  game.endTextCommandDisplayText(0, 0, 0);

  alt.Utils.drawText3dThisFrame(
    [
      game.isPedRagdoll(this.ped) && "Ragdoll",
      game.isPedRunningRagdollTask(this.ped) && "Running ragdoll task",
    ].join(", "),
    // Object.entries(PED_TASK)
    //   .filter(
    //     ([, value]) =>
    //       typeof value === "number" && game.getIsTaskActive(this.ped, value)
    //   )
    //   .map(([key]) => key)
    //   .join(", "),
    pos
  );
}
