import alt from "alt-client";
import game from "natives";
import { NpcSyncPayload } from "@shared/modules/npc/types";
import { ServerEvents } from "@shared/events/server";
import { isPedUnderVehicle } from "@/utility/ped";
import { StreamedNpc } from "../ped";

/**
 * Syncs local ped with server
 */
export function syncToServer(this: StreamedNpc) {
  if (!this.netOwned || !this.ready) {
    return;
  }

  const position = game.getEntityCoords(this.ped, true);
  const heading = game.getEntityHeading(this.ped);
  const rotation = game.getEntityRotation(this.ped, 2);
  const velocity = game.getEntityVelocity(this.ped);
  const rotationVelocity = game.getEntityRotationVelocity(this.ped);
  const isUnderVehicle = isPedUnderVehicle(this.ped);

  const payload: NpcSyncPayload = {
    id: this.npc.id,
  };

  if (position.distanceTo(this.npc.position) !== 0) {
    payload.position = position;
  }

  if (!game.isPedRagdoll(this.ped) && !game.isPedRunningRagdollTask(this.ped)) {
    if (heading !== this.npc.heading) {
      payload.heading = heading;
    }

    if (this.npc.rotation.distanceTo(rotation) > 0.1) {
      payload.rotation = rotation;
    }

    if (rotationVelocity.distanceTo(this.npc.rotationVelocity[1]) > 0.1) {
      payload.rotationVelocity = rotationVelocity;
    }
  }

  if (this.npc.isRagdollActive !== game.isPedRagdoll(this.ped)) {
    payload.isRagdollActive = game.isPedRagdoll(this.ped);
  }

  if (
    this.npc.isRunningRagdollTask !== game.isPedRunningRagdollTask(this.ped)
  ) {
    payload.isRunningRagdollTask = game.isPedRunningRagdollTask(this.ped);
  }

  if (velocity.distanceTo(this.npc.velocity[1]) > 0.1) {
    payload.velocity = velocity;
  }

  if (isUnderVehicle !== this.npc.isUnderVehicle) {
    payload.isUnderVehicle = isUnderVehicle;
  }

  if (Object.keys(payload).length > 1) {
    alt.emitServerRaw(ServerEvents.FromClient.SYNC_NPC, payload);
  }
}
