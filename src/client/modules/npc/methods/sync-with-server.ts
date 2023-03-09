import alt from "alt-client";
import native from "natives";
import { isPedUnderVehicle } from "@/utility/user-interface/ped";
import { MAX_PED_HEALTH } from "../constants";
import { StreamedNpc } from "../ped";

/**
 * Updates local ped with data from the server
 */
export async function syncWithServer(
  this: StreamedNpc,
  { force = false } = {}
) {
  if (!this.ped) {
    return;
  }

  // Update ped health
  const expectedPedHealth =
    (this.npc.health / this.npc.totalHealth) * MAX_PED_HEALTH;

  if (native.getEntityHealth(this.ped) > expectedPedHealth) {
    const damage = native.getEntityHealth(this.ped) - expectedPedHealth;

    native.applyDamageToPed(this.ped, damage, true, 0);
  }

  if (
    this.npc.weaponHash !== native.getCurrentPedWeaponEntityIndex(this.ped, 0)
  ) {
    if (this.npc.weaponHash) {
      native.giveWeaponToPed(this.ped, this.npc.weaponHash, -1, true, true);
    } else {
      native.removeAllPedWeapons(this.ped, true);
    }
  }

  if (this.netOwned && !force) {
    // We own this ped, so we don't need to update game data
    return;
  }

  const doNotApplyPhysics =
    native.isPedRagdoll(this.ped) || native.isPedRunningRagdollTask(this.ped);

  // Update ped position
  const { x, y, z } = native.getEntityCoords(this.ped, false);
  const { x: x2, y: y2, z: z2 } = this.npc.position;

  if (native.getDistanceBetweenCoords(x, y, z, x2, y2, z2, false) > 0.3) {
    native.setEntityCoordsNoOffset(this.ped, x2, y2, z2, true, true, true);
  }

  // Rotation
  if (
    !doNotApplyPhysics &&
    this.npc.rotation.distanceTo(native.getEntityRotation(this.ped, 2)) > 0.1
  ) {
    alt.log(
      "rotation",
      this.npc.rotation.x,
      this.npc.rotation.y,
      this.npc.rotation.z
    );
    native.setEntityRotation(
      this.ped,
      this.npc.rotation.x,
      this.npc.rotation.y,
      this.npc.rotation.z,
      2,
      false
    );
  }

  // Update ped heading
  if (native.getEntityHeading(this.ped) !== this.npc.heading) {
    if (this.npc.isUnderVehicle) {
      alt.log("is under vehicle");
      native.setEntityHeading(this.ped, this.npc.heading);
    } else if (!doNotApplyPhysics) {
      alt.log("set desired heading");
      native.setPedDesiredHeading(this.ped, this.npc.heading);
    }
  }

  // Update ragdoll
  if (this.npc.isUnderVehicle && !isPedUnderVehicle(this.ped)) {
    if (force) {
      native.setEntityCollision(this.ped, false, true);
      native.setEntityCoordsNoOffset(this.ped, x2, y2, z2, false, false, false);
      native.freezeEntityPosition(this.ped, true);

      await alt.Utils.waitFor(() => !isPedUnderVehicle(this.ped));

      native.setEntityCollision(this.ped, true, true);
      native.freezeEntityPosition(this.ped, false);
    }
    native.setPedToRagdoll(this.ped, 1000, 0, 0, false, false, false);
  } else {
    if (doNotApplyPhysics) {
      if (!this.npc.isRagdollActive && !this.npc.isRunningRagdollTask) {
        alt.log("clear ped tasks immediately");
        native.clearPedTasksImmediately(this.ped);
      }
    } else if (this.npc.isRagdollActive) {
      native.setPedToRagdoll(this.ped, 0, 0, 0, false, false, false);
    } else if (
      this.npc.isRunningRagdollTask &&
      !native.isPedRunningRagdollTask(this.ped)
    ) {
      // native.setPedToRagdoll(this.ped, 0, 500, 0, false, false, false);
    }
  }

  // Update ped velocity
  const [lastUpdateVelocity, velocity] = this.npc.velocity;

  if (this.lastUpdate.velocity !== lastUpdateVelocity) {
    const adjustedVelocity = velocity.mul(
      0.97 ** ((Date.now() - lastUpdateVelocity) / 5)
    );
    native.setEntityVelocity(
      this.ped,
      adjustedVelocity.x,
      adjustedVelocity.y,
      adjustedVelocity.z
    );
    this.lastUpdate.velocity = lastUpdateVelocity;
  }

  // Update ped rotation velocity
  const [lastUpdateRotationVelocity, rotationVelocity] =
    this.npc.rotationVelocity;

  if (this.lastUpdate.rotationVelocity !== lastUpdateRotationVelocity) {
    if (!doNotApplyPhysics) {
      alt.log("set entity angular velocity");
      native.setEntityAngularVelocity(
        this.ped,
        rotationVelocity.x,
        rotationVelocity.y,
        rotationVelocity.z
      );
    }
    this.lastUpdate.rotationVelocity = lastUpdateRotationVelocity;
  }
}
