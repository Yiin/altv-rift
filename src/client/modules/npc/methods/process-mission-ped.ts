import alt from "alt-client";
import native from "natives";
import { MAX_PED_HEALTH } from "../constants";
import { StreamedNpc } from "../ped";
import { applyFireDamage } from "./apply-fire-damage";
import { applyPedResetFlags } from "./apply-ped-reset-flags";
import { applyWeaponDamage } from "./apply-weapon-damage";

export function processMissionPed(this: StreamedNpc) {
  applyPedResetFlags(this.ped);

  const { damage, damageData } = applyWeaponDamage(this);

  if (damage) {
    this.npc.health -= damage;
    this.applyDamage(damageData);

    // prevent bugs where ped dies when it shouldn't
    if (this.npc.health > 0 && native.isPedDeadOrDying(this.ped, false)) {
      native.freezeEntityPosition(this.ped, true);
      native.resurrectPed(this.ped);
      native.clearPedTasksImmediately(this.ped);
      native.setEntityHealth(
        this.ped,
        (this.npc.heading / this.npc.totalHealth) * MAX_PED_HEALTH,
        0
      );

      alt.nextTick(() => {
        native.freezeEntityPosition(this.ped, false);
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

  this.lastPedHealth = native.getEntityHealth(this.ped);

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
