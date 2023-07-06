import alt from "alt-client";
import game from "natives";
import { LastUpdateTimestamp, Task } from "@shared/modules/npc/types";
import { Npc } from "@shared/modules/npc/npc";
import { everyTickWhile, intervalWhile } from "@/utility/event-helpers";
import { npcSyncStore } from "@/store/npc-sync.store";
import {
  PED_CONFIG_FLAG,
  COMBAT_ATTRIBUTE,
  FLEE_ATTRIBUTE,
} from "./constants/ped-flags";
import {
  syncToServer,
  syncWithServer,
  runCurrentTask,
  stopRunningTask,
  createLocalPed,
  processMissionPed,
  isStillRunningTask,
} from "./methods";
import { applyDamage } from "./methods/apply-damage";
import { MAX_PED_HEALTH } from "./constants";

export class StreamedNpc {
  ped!: number;
  ready = false;

  runningTask?: Task;
  taskIsRunning = false;

  lastPedHealth!: number;
  lastFireTick = 0;

  lastUpdate: Partial<Record<keyof Npc, LastUpdateTimestamp>> = {};

  constructor(public npc: Npc) {
    this.createLocalPed(npc.modelHash);
  }

  get isStreamedIn() {
    return npcSyncStore.streamedIn.some(({ id }) => this.npc.id === id);
  }

  get netOwned() {
    return npcSyncStore.netOwnerOf.has(this.npc.id);
  }

  setupStaticPed() {
    game.freezeEntityPosition(this.ped, true);
    game.setEntityInvincible(this.ped, true);
    game.setPedCanRagdoll(this.ped, false);
  }

  setupMissionPed() {
    game.setPedAsEnemy(this.ped, true);

    game.setEntityProofs(
      this.ped,
      false,
      false,
      false,
      // prevents ped from dying when driven over
      // TODO: check if strill necessary
      true,
      false,
      false,
      false,
      false
    );
    game.setPedMaxHealth(this.ped, MAX_PED_HEALTH);
    game.setEntityHealth(this.ped, MAX_PED_HEALTH, 0);
    game.setPedSuffersCriticalHits(this.ped, false);
    game.setPedDiesWhenInjured(this.ped, false);
    game.setPedPathCanUseClimbovers(this.ped, true);
    game.setPedPathCanUseLadders(this.ped, true);
    game.setPedPathAvoidFire(this.ped, true);
    game.setPedPathPreferToAvoidWater(this.ped, true);
    game.setPedPathClimbCostModifier(this.ped, 0);
    game.setPedCanEvasiveDive(this.ped, false);
    game.setPedDropsWeaponsWhenDead(this.ped, false);
    game.setPedConfigFlag(
      this.ped,
      PED_CONFIG_FLAG.DisableGoToWritheWhenInjured,
      true
    );
    game.setPedConfigFlag(this.ped, PED_CONFIG_FLAG.IgnoreBeingOnFire, true);
    game.setPedConfigFlag(
      this.ped,
      PED_CONFIG_FLAG.DontActivateRagdollFromExplosions,
      true
    );
    game.setPedConfigFlag(
      this.ped,
      PED_CONFIG_FLAG.DisableExplosionReactions,
      true
    );
    game.setIgnoreLowPriorityShockingEvents(this.ped, true);
    game.setPedCombatAttributes(
      this.ped,
      COMBAT_ATTRIBUTE.CA_ALWAYS_FLEE,
      false
    );
    game.setPedFleeAttributes(this.ped, FLEE_ATTRIBUTE.FA_NEVER_FLEE, true);

    // game.setRagdollBlockingFlags(
    //   this.ped,
    //   RAGDOLL_BLOCKING_FLAGS.RBF_PED_RAGDOLL_BUMP |
    //     RAGDOLL_BLOCKING_FLAGS.RBF_PLAYER_BUMP |
    //     RAGDOLL_BLOCKING_FLAGS.RBF_PLAYER_IMPACT |
    //     RAGDOLL_BLOCKING_FLAGS.RBF_PLAYER_RAGDOLL_BUMP |
    //     RAGDOLL_BLOCKING_FLAGS.RBF_MELEE
    // );

    game.setEntityCanOnlyBeDamagedByEntity(this.ped, alt.Player.local.scriptID);

    everyTickWhile(() => this.isStreamedIn, this.processMissionPed);

    intervalWhile(
      () => this.isStreamedIn,
      () => this.syncToServer(),
      30
    );
  }

  createLocalPed = createLocalPed.bind(this);
  syncToServer = syncToServer.bind(this);
  syncWithServer = syncWithServer.bind(this);
  runCurrentTask = runCurrentTask.bind(this);
  isStillRunningTask = isStillRunningTask.bind(this);
  stopRunningTask = stopRunningTask.bind(this);
  processMissionPed = processMissionPed.bind(this);
  applyDamage = applyDamage.bind(this);
}

// game.pedHasUseScenarioTask()
