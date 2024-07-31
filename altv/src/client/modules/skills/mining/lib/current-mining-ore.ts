import alt from "@altv/client";

let ore: alt.VirtualEntity | null = null;

export function setMiningOre(entity: alt.VirtualEntity | null) {
  ore = entity;
}

export function getMiningOre() {
  if (!ore) {
    throw new Error("No ore is being chopped.");
  }
  return ore;
}

export function haveOreToChop() {
  return ore !== null;
}
