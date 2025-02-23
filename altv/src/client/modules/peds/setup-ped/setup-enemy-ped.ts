import alt from "@altv/client";
import game from "@altv/natives";
import { RAGDOLL_BLOCKING_FLAGS } from "@shared/enums/ragdoll-blocking-flags";
import { PedFlags } from "@shared/modules/ped";
import { everyTickWhile } from "@/core/user-interface/event-helpers";
import {
  COMBAT_ATTRIBUTE,
  PED_CONFIG_FLAG,
  PED_RESET_FLAG,
  PedRelationship,
  PedRelationshipGroup,
} from "@/core/constants/ped-flags";

const pedTickUpdates = new WeakMap<alt.Ped, alt.Timers.EveryTick>();

game.addRelationshipGroup(PedRelationshipGroup.Friendly, alt.hash(PedRelationshipGroup.Friendly));
game.addRelationshipGroup(PedRelationshipGroup.Enemy, alt.hash(PedRelationshipGroup.Enemy));

game.setRelationshipBetweenGroups(
  PedRelationship.Companion,
  alt.hash(PedRelationshipGroup.Friendly),
  alt.hash(PedRelationshipGroup.Friendly),
);
game.setRelationshipBetweenGroups(
  PedRelationship.Hate,
  alt.hash(PedRelationshipGroup.Friendly),
  alt.hash(PedRelationshipGroup.Enemy),
);
game.setRelationshipBetweenGroups(
  PedRelationship.Hate,
  alt.hash(PedRelationshipGroup.Enemy),
  alt.hash(PedRelationshipGroup.Friendly),
);

/**
 * Not sure if needed, added just in case ped behaves weirdly to newly streamed-in players
 */
alt.Timers.setInterval(() => {
  game.setPedRelationshipGroupHash(alt.Player.local, alt.hash(PedRelationshipGroup.Friendly));

  for (const ped of alt.Ped.streamedIn) {
    if (
      typeof ped.streamSyncedMeta.flags === "undefined" ||
      ped.streamSyncedMeta.flags & PedFlags.Peaceful
    ) {
      continue;
    }

    game.setPedRelationshipGroupHash(ped, alt.hash(PedRelationshipGroup.Enemy));

    if (!game.isPedInCombat(ped, 0) && ped.meta.wasInCombat) {
      game.taskGuardAssignedDefensiveArea(ped, ped.pos.x, ped.pos.y, ped.pos.z, 0, 50, -1);
      ped.meta.wasInCombat = false;
    } else {
      ped.meta.wasInCombat = game.isPedInCombat(ped, 0);
    }
  }
}, 100);

export async function setupEnemyPed(ped: alt.Ped): Promise<void> {
  console.log("setupTerroristPed", ped.scriptID);
  await alt.Utils.waitFor(() => ped.valid && ped.scriptID !== 0);
  console.log("ped valid", ped.scriptID);

  const onSpawned = alt.Events.onSpawned(() => {
    onSpawned.destroy();
    setupEnemyPed(ped);
  });

  game.setPedAsEnemy(ped, true);
  game.addBlipForEntity(ped);
  game.setPedHasAiBlip(ped, true);
  game.setEntityAsMissionEntity(ped, true, true);

  game.setRagdollBlockingFlags(ped, RAGDOLL_BLOCKING_FLAGS.RBF_ALL);
  game.setPedConfigFlag(ped, PED_CONFIG_FLAG.NoCriticalHits, true);
  game.setPedConfigFlag(ped, PED_CONFIG_FLAG.ForceDieIfInjured, false);
  game.setPedConfigFlag(ped, PED_CONFIG_FLAG.DisableGoToWritheWhenInjured, true);
  game.setPedConfigFlag(ped, PED_CONFIG_FLAG.TreatNonFriendlyAsHateWhenInCombat, true);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.Aggressive, true);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.RequiresLosToAim, true);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.RequiresLosToShoot, true);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.AlwaysFight, true);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.CanCharge, true);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.PermitChargeBeyondDefensiveArea, false);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.CanChaseTargetOnFoot, false);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.CanFightArmedPedsWhenNotArmed, true);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.DisableAllRandomsFlee, true);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.DisableBulletReactions, true);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.UseCover, Math.random() > 0.5);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.SwitchToAdvanceIfCantFindCover, true);

  // if (ped.netOwner === alt.Player.local) {
  game.taskGuardAssignedDefensiveArea(
    ped,
    ped.pos.x,
    ped.pos.y,
    ped.pos.z,
    0,
    5 + Math.random() * 5,
    -1,
  );

  if (ped.streamSyncedMeta.weapon) {
    game.giveWeaponToPed(ped, ped.streamSyncedMeta.weapon, 9999, true, true);
  }
  // }

  if (!pedTickUpdates.has(ped)) {
    pedTickUpdates.set(
      ped,
      everyTickWhile(
        () => ped.valid,
        () => {
          game.setPedResetFlag(ped, PED_RESET_FLAG.BlockFallTaskFromExplosionDamage, true);
          game.setPedResetFlag(ped, PED_RESET_FLAG.BlockWeaponReactionsUnlessDead, true);
          game.setPedResetFlag(ped, PED_RESET_FLAG.DisablePotentialBlastReactions, true);
          game.setPedResetFlag(ped, PED_RESET_FLAG.PreventAllMeleeTakedowns, true);
        },
      ),
    );
  }
}
