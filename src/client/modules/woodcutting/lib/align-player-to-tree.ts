import alt from "alt-client";
import game from "natives";
import { everyTickWhile } from "@/utility/event-helpers";

let diff: number, angle: number, currentHeading: number;

export async function alignPlayerToTree(ped: number, requiredHeading: number) {
  everyTickWhile(
    () => {
      currentHeading = game.getEntityHeading(ped);
      diff = Math.abs(requiredHeading - currentHeading);
      angle = Math.min(diff, 360 - diff);
      return angle > 10;
    },
    () => {
      if (currentHeading < requiredHeading) {
        game.setEntityHeading(ped, currentHeading + 5);
      } else {
        game.setEntityHeading(ped, currentHeading - 5);
      }
    }
  );
  await alt.Utils.waitFor(() => angle <= 10, 3000);
}
