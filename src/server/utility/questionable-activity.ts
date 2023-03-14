import { Player } from "alt-server";

export function checkForQuestionableActivity(
  player: Player,
  condition: boolean,
  context: string
) {
  if (condition) {
    player.kick(`Questionable activity. (${context})`);
    throw new Error("Questionable activity detected");
  }
}
