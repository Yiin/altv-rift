import * as alt from "@altv/client";

export enum AnchorType {
  Ped,
  Player,
  Vehicle,
  Tree,
}

export type AnchorEntityMap = {
  [AnchorType.Ped]: alt.Ped;
  [AnchorType.Player]: alt.Player;
  [AnchorType.Vehicle]: alt.Vehicle;
  [AnchorType.Tree]: alt.VirtualEntity;
};
