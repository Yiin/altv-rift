import { Player } from "alt-server";

export function checkForQuestionableActivity(
  player: Player,
  isQuestionable: boolean,
  context: string
) {
  if (isQuestionable) {
    player.kick(`Questionable activity. (${context})`);
    throw new Error("Questionable activity detected");
  }
}
