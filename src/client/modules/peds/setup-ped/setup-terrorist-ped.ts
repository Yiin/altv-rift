import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { RAGDOLL_BLOCKING_FLAGS } from "@shared/enums/ragdoll-blocking-flags";
import { PedFlags } from "@shared/modules/ped";
import { everyTickWhile } from "@/core/utility/event-helpers";
import { COMBAT_ATTRIBUTE, PED_CONFIG_FLAG, PED_RESET_FLAG } from "@/core/constants/ped-flags";

game.addRelationshipGroup("Friendly", alt.hash("Friendly"));
game.addRelationshipGroup("Enemy", alt.hash("Enemy"));

game.setRelationshipBetweenGroups(0, alt.hash("Friendly"), alt.hash("Friendly"));
game.setRelationshipBetweenGroups(5, alt.hash("Friendly"), alt.hash("Enemy"));
game.setRelationshipBetweenGroups(5, alt.hash("Enemy"), alt.hash("Friendly"));

alt.Timers.setInterval(() => {
  game.setPedRelationshipGroupHash(alt.Player.local, alt.hash("Friendly"));

  for (const player of alt.Player.streamedIn) {
    if (player === alt.Player.local) {
      continue;
    }

    game.setPedRelationshipGroupHash(player, alt.hash("Friendly"));
  }

  for (const ped of alt.Ped.streamedIn) {
    if (ped.netOwner !== alt.Player.local) {
      continue;
    }

    game.setPedRelationshipGroupHash(ped, alt.hash("Enemy"));

    if (!game.isPedInCombat(ped, 0) && ped.meta.wasInCombat) {
      game.taskGuardAssignedDefensiveArea(ped, ped.pos.x, ped.pos.y, ped.pos.z, 0, 50, -1);
      ped.meta.wasInCombat = false;
    } else {
      ped.meta.wasInCombat = game.isPedInCombat(ped, 0);
    }
  }
}, 100);

alt.Events.onNetOwnerChange(({ entity, newOwner }) => {
  if (entity instanceof alt.Ped && newOwner === alt.Player.local) {
    if (!((entity.streamSyncedMeta.flags ?? 0) & PedFlags.Peaceful)) {
      setupTerroristPed(entity);
    }
  }
});

export async function setupTerroristPed(ped: alt.Ped) {
  if (ped.netOwner !== alt.Player.local) {
    return;
  }

  await alt.Utils.waitFor(() => ped.valid && ped.scriptID !== 0);

  const onSpawned = alt.Events.onSpawned(() => {
    if (!ped.valid || !ped.scriptID) {
      onSpawned.destroy();
      return;
    }
    setupTerroristPed(ped);
  });

  game.setPedAsEnemy(ped, true);

  game.setRagdollBlockingFlags(ped, RAGDOLL_BLOCKING_FLAGS.RBF_ALL);
  game.setPedConfigFlag(ped, PED_CONFIG_FLAG.NoCriticalHits, true);
  game.setPedConfigFlag(ped, PED_CONFIG_FLAG.DisableGoToWritheWhenInjured, true);
  game.setPedConfigFlag(ped, PED_CONFIG_FLAG.TreatNonFriendlyAsHateWhenInCombat, true);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.Aggressive, true);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.AlwaysFight, true);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.DisableBulletReactions, true);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.UseCover, Math.random() > 0.5);
  game.setPedCombatAttributes(ped, COMBAT_ATTRIBUTE.SwitchToAdvanceIfCantFindCover, true);

  game.taskGuardAssignedDefensiveArea(
    ped,
    ped.pos.x,
    ped.pos.y,
    ped.pos.z,
    0,
    5 + Math.random() * 5,
    -1
  );

  if (ped.streamSyncedMeta.weapon) {
    game.giveWeaponToPed(ped, ped.streamSyncedMeta.weapon, 9999, true, true);
  }

  everyTickWhile(
    () => ped.valid,
    () => {
      game.setPedResetFlag(ped, PED_RESET_FLAG.BlockFallTaskFromExplosionDamage, true);
      game.setPedResetFlag(ped, PED_RESET_FLAG.BlockWeaponReactionsUnlessDead, true);
      game.setPedResetFlag(ped, PED_RESET_FLAG.DisablePotentialBlastReactions, true);
    }
  );
}
