import alt from "alt-client";
import game from "natives";
import { MAX_PED_HEALTH } from "../constants";
import { StreamedNpc } from "../ped";
import { applyFireDamage } from "./apply-fire-damage";
import { applyPedResetFlags } from "./apply-ped-reset-flags";
import { applyWeaponDamage } from "./apply-weapon-damage";

export function processMissionPed(this: StreamedNpc) {
  applyPedResetFlags(this.ped);

  const weaponDamageData = applyWeaponDamage(this);

  if (weaponDamageData) {
    this.npc.health -= weaponDamageData.damage;
    this.applyDamage(weaponDamageData.damageData);

    // prevent bugs where ped dies when it shouldn't
    if (this.npc.health > 0 && game.isPedDeadOrDying(this.ped, false)) {
      game.freezeEntityPosition(this.ped, true);
      game.resurrectPed(this.ped);
      game.clearPedTasksImmediately(this.ped);
      game.setEntityHealth(
        this.ped,
        (this.npc.heading / this.npc.maxHealth) * MAX_PED_HEALTH,
        0
      );

      alt.nextTick(() => {
        game.freezeEntityPosition(this.ped, false);
      });
    }
  }

  if (this.netOwned) {
    const damage = applyFireDamage(this);

    if (damage) {
      this.npc.health -= damage;
      this.applyDamage({ nativeDamage: damage });
    }
  }

  this.lastPedHealth = game.getEntityHealth(this.ped);

  if (this.isStillRunningTask() && !this.taskIsRunning) {
    this.taskIsRunning = true;
  }
  if (!this.npc.currentTask) {
    if (this.taskIsRunning && this.isStillRunningTask()) {
      alt.log("Task is still running, but no task is set. (1)");
      this.stopRunningTask();
      return;
    }
  } else if (
    this.netOwned &&
    this.taskIsRunning &&
    !this.isStillRunningTask()
  ) {
    alt.log("Task is no longer running, but task is set. (2)");
    this.stopRunningTask();
    return;
  }
}
