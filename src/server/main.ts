// setup
import "@/sentry";
import "./setup-globals";
import "./database";
import "./prototypes/player";

import alt, { Vector3 } from "alt-server";
// scenes
import "./modules/chat";
import "./modules/discord-auth";
import "./modules/character-selection";
import "./modules/inventory";
import "./modules/npc";
import "./scenes/game";

alt.onClient("tp_to_waypoint", (player, x, y, z) => {
  player.pos = new alt.Vector3(x, y, z);
});

alt.on("weaponDamage", (source, target, weapon, damage) => {
  if (source instanceof alt.Player && target instanceof alt.Player) {
    alt.log(
      `Damage: ${damage} | Weapon: ${weapon} | Attacker: ${target.name} | Target: ${source.name}`
    );
  }
});

alt.log(new Vector3(0.1, 0.1, 0.5).distanceTo(new Vector3(0.1, 0.1, 0.61)));
