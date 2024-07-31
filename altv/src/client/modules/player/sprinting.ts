import alt from "@altv/client";
import game from "@altv/natives";

let lastStamina = game.getPlayerSprintStaminaRemaining(alt.Player.local.scriptID);
let wasSprinting = false;
let isSprinting = false;

alt.Timers.setInterval(() => {
  const currentStamina = game.getPlayerSprintStaminaRemaining(alt.Player.local.scriptID);

  wasSprinting = isSprinting;
  isSprinting = currentStamina > lastStamina;
  lastStamina = currentStamina;

  if (!wasSprinting && isSprinting) {
    alt.Events.emit("playerSprintingStarted");
  } else if (wasSprinting && !isSprinting) {
    alt.Events.emit("playerSprintingEnded");
  }
}, 200);

export function isPlayerSprinting() {
  return isSprinting;
}
