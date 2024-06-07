import alt from "@altv/client";

export function isQuestPed(ped: alt.Ped) {
  /**
   * If ped has active interactions of quest type, we consider the ped quest ped
   */
  return ped.interactions?.value.some(({ icon }) => icon === "quest") ?? false;
}
