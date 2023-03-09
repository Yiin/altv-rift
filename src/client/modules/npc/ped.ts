import alt from "alt-client";
import native from "natives";
import { LastUpdateTimestamp, Task } from "@shared/modules/npc/types";
import { Npc } from "@shared/modules/npc/npc";
import { RPC } from "@shared/constants/rpcs";
import { everyTickWhile, intervalWhile } from "@/utility/event-helpers";
import { rpc } from "@/rpc";
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
  renderNametag,
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
    native.freezeEntityPosition(this.ped, true);
    native.setEntityInvincible(this.ped, true);
    native.setPedCanRagdoll(this.ped, false);
  }

  setupMissionPed() {
    native.setPedAsEnemy(this.ped, true);

    native.setEntityProofs(
      this.ped,
      false,
      false,
      false,
      true, // prevents ped from dying when driven over
      false,
      false,
      false,
      false
    );
    native.setPedMaxHealth(this.ped, MAX_PED_HEALTH);
    native.setEntityHealth(this.ped, MAX_PED_HEALTH, 0);
    native.setPedSuffersCriticalHits(this.ped, false);
    native.setPedDiesWhenInjured(this.ped, false);
    native.setPedPathCanUseClimbovers(this.ped, true);
    native.setPedPathCanUseLadders(this.ped, true);
    native.setPedPathAvoidFire(this.ped, true);
    native.setPedPathPreferToAvoidWater(this.ped, true);
    native.setPedPathClimbCostModifier(this.ped, 0);
    native.setPedCanEvasiveDive(this.ped, false);
    native.setPedConfigFlag(this.ped, PED_CONFIG_FLAG.IgnoreBeingOnFire, true);
    native.setPedConfigFlag(
      this.ped,
      PED_CONFIG_FLAG.DontActivateRagdollFromExplosions,
      true
    );
    native.setPedConfigFlag(
      this.ped,
      PED_CONFIG_FLAG.DisableExplosionReactions,
      true
    );
    native.setIgnoreLowPriorityShockingEvents(this.ped, true);
    native.setPedCombatAttributes(
      this.ped,
      COMBAT_ATTRIBUTE.CA_ALWAYS_FLEE,
      false
    );
    native.setPedFleeAttributes(this.ped, FLEE_ATTRIBUTE.FA_NEVER_FLEE, true);

    // native.setRagdollBlockingFlags(
    //   this.ped,
    //   RAGDOLL_BLOCKING_FLAGS.RBF_PED_RAGDOLL_BUMP |
    //     RAGDOLL_BLOCKING_FLAGS.RBF_PLAYER_BUMP |
    //     RAGDOLL_BLOCKING_FLAGS.RBF_PLAYER_IMPACT |
    //     RAGDOLL_BLOCKING_FLAGS.RBF_PLAYER_RAGDOLL_BUMP |
    //     RAGDOLL_BLOCKING_FLAGS.RBF_MELEE
    // );

    native.setEntityCanOnlyBeDamagedByEntity(
      this.ped,
      alt.Player.local.scriptID
    );

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
  renderNametag = renderNametag.bind(this);
}
