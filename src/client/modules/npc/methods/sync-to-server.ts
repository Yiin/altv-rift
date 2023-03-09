import alt from "alt-client";
import native from "natives";
import { Events } from "@shared/constants/events";
import { NpcSyncPayload } from "@shared/modules/npc/types";
import { isPedUnderVehicle } from "@/utility/user-interface/ped";
import { StreamedNpc } from "../ped";

/**
 * Syncs local ped with server
 */
export function syncToServer(this: StreamedNpc) {
  if (!this.netOwned || !this.ready) {
    return;
  }

  const position = native.getEntityCoords(this.ped, true);
  const heading = native.getEntityHeading(this.ped);
  const rotation = native.getEntityRotation(this.ped, 2);
  const velocity = native.getEntityVelocity(this.ped);
  const rotationVelocity = native.getEntityRotationVelocity(this.ped);
  const isUnderVehicle = isPedUnderVehicle(this.ped);

  const payload: NpcSyncPayload = {
    id: this.npc.id,
  };

  if (position.distanceTo(this.npc.position) !== 0) {
    payload.position = position;
  }

  if (
    !native.isPedRagdoll(this.ped) &&
    !native.isPedRunningRagdollTask(this.ped)
  ) {
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

  if (this.npc.isRagdollActive !== native.isPedRagdoll(this.ped)) {
    payload.isRagdollActive = native.isPedRagdoll(this.ped);
  }

  if (
    this.npc.isRunningRagdollTask !== native.isPedRunningRagdollTask(this.ped)
  ) {
    payload.isRunningRagdollTask = native.isPedRunningRagdollTask(this.ped);
  }

  if (velocity.distanceTo(this.npc.velocity[1]) > 0.1) {
    payload.velocity = velocity;
  }

  if (isUnderVehicle !== this.npc.isUnderVehicle) {
    payload.isUnderVehicle = isUnderVehicle;
  }

  if (Object.keys(payload).length > 1) {
    alt.emitServerRaw(Events.Server.SYNC_NPC, payload);
  }
}
