import * as alt from "@altv/server";
import { ClientEvents } from "@shared/events/client";

alt.Events.onPlayerDamage(({ attacker, player, healthDamage, armourDamage }) => {
  if (attacker instanceof alt.Player) {
    if (armourDamage > 0) {
      attacker.emit(
        ClientEvents.FromServer.DISPLAY_DAMAGE_HIT,
        player.type,
        player.id,
        armourDamage,
        "armor"
      );
    }
    if (healthDamage > 0) {
      attacker.emit(
        ClientEvents.FromServer.DISPLAY_DAMAGE_HIT,
        player.type,
        player.id,
        healthDamage,
        "health"
      );
    }
  }
});

alt.Events.onPedDamage(({ attacker, ped, armourDamage, healthDamage }) => {
  if (attacker instanceof alt.Player) {
    if (armourDamage > 0) {
      attacker.emit(
        ClientEvents.FromServer.DISPLAY_DAMAGE_HIT,
        ped.type,
        ped.id,
        armourDamage,
        "armor"
      );
    }
    if (healthDamage > 0) {
      attacker.emit(
        ClientEvents.FromServer.DISPLAY_DAMAGE_HIT,
        ped.type,
        ped.id,
        healthDamage,
        "health"
      );
    }
  }
});
