import alt from "alt-client";
import game from "natives";
import { isPedUnderVehicle } from "@/utility/ped";
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
    (this.npc.health / this.npc.maxHealth) * MAX_PED_HEALTH;

  if (game.getEntityHealth(this.ped) > expectedPedHealth) {
    const damage = game.getEntityHealth(this.ped) - expectedPedHealth;

    game.applyDamageToPed(this.ped, damage, true, 0);
  }

  if (
    this.npc.weaponHash !== game.getCurrentPedWeaponEntityIndex(this.ped, 0)
  ) {
    if (this.npc.weaponHash) {
      game.giveWeaponToPed(this.ped, this.npc.weaponHash, -1, true, true);
    } else {
      game.removeAllPedWeapons(this.ped, true);
    }
  }

  if (this.netOwned && !force) {
    // We own this ped, so we don't need to update game data
    return;
  }

  const doNotApplyPhysics =
    game.isPedRagdoll(this.ped) || game.isPedRunningRagdollTask(this.ped);

  // Update ped position
  const { x, y, z } = game.getEntityCoords(this.ped, false);
  const { x: x2, y: y2, z: z2 } = this.npc.position;

  if (game.getDistanceBetweenCoords(x, y, z, x2, y2, z2, false) > 0.3) {
    game.setEntityCoordsNoOffset(this.ped, x2, y2, z2, true, true, true);
  }

  // Rotation
  if (
    !doNotApplyPhysics &&
    this.npc.rotation.distanceTo(game.getEntityRotation(this.ped, 2)) > 0.1
  ) {
    alt.log(
      "rotation",
      this.npc.rotation.x,
      this.npc.rotation.y,
      this.npc.rotation.z
    );
    game.setEntityRotation(
      this.ped,
      this.npc.rotation.x,
      this.npc.rotation.y,
      this.npc.rotation.z,
      2,
      false
    );
  }

  // Update ped heading
  if (game.getEntityHeading(this.ped) !== this.npc.heading) {
    if (this.npc.isUnderVehicle) {
      alt.log("is under vehicle");
      game.setEntityHeading(this.ped, this.npc.heading);
    } else if (!doNotApplyPhysics) {
      alt.log("set desired heading");
      game.setPedDesiredHeading(this.ped, this.npc.heading);
    }
  }

  // Update ragdoll
  if (this.npc.isUnderVehicle && !isPedUnderVehicle(this.ped)) {
    if (force) {
      game.setEntityCollision(this.ped, false, true);
      game.setEntityCoordsNoOffset(this.ped, x2, y2, z2, false, false, false);
      game.freezeEntityPosition(this.ped, true);

      await alt.Utils.waitFor(() => !isPedUnderVehicle(this.ped));

      game.setEntityCollision(this.ped, true, true);
      game.freezeEntityPosition(this.ped, false);
    }
    game.setPedToRagdoll(this.ped, 1000, 0, 0, false, false, false);
  } else {
    if (doNotApplyPhysics) {
      if (!this.npc.isRagdollActive && !this.npc.isRunningRagdollTask) {
        alt.log("clear ped tasks immediately");
        game.clearPedTasksImmediately(this.ped);
      }
    } else if (this.npc.isRagdollActive) {
      game.setPedToRagdoll(this.ped, 0, 0, 0, false, false, false);
    } else if (
      this.npc.isRunningRagdollTask &&
      !game.isPedRunningRagdollTask(this.ped)
    ) {
      // game.setPedToRagdoll(this.ped, 0, 500, 0, false, false, false);
    }
  }

  // Update ped velocity
  const [lastUpdateVelocity, velocity] = this.npc.velocity;

  if (this.lastUpdate.velocity !== lastUpdateVelocity) {
    const adjustedVelocity = velocity.mul(
      0.97 ** ((Date.now() - lastUpdateVelocity) / 5)
    );
    game.setEntityVelocity(
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
      game.setEntityAngularVelocity(
        this.ped,
        rotationVelocity.x,
        rotationVelocity.y,
        rotationVelocity.z
      );
    }
    this.lastUpdate.rotationVelocity = lastUpdateRotationVelocity;
  }
}
