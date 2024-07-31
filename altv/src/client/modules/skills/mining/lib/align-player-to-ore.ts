import alt from "@altv/client";
import game from "@altv/natives";
import { everyTickWhile } from "@/core/user-interface/event-helpers";

let diff: number, angle: number, currentHeading: number;

export async function alignPlayerToOre(requiredHeading: number) {
  const player = alt.Player.local;

  everyTickWhile(
    () => {
      currentHeading = game.getEntityHeading(player);
      diff = Math.abs(requiredHeading - currentHeading);
      angle = Math.min(diff, 360 - diff);
      return angle > 10;
    },
    () => {
      if (currentHeading < requiredHeading) {
        game.setEntityHeading(player, currentHeading + 5);
      } else {
        game.setEntityHeading(player, currentHeading - 5);
      }
    },
  );
  await alt.Utils.waitFor(() => angle <= 10, 3000);
}
