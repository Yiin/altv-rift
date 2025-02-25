import alt from "@altv/client";

export enum AnchorType {
  Ped = 1,
  Player,
  Vehicle,
  Tree,
  Storage,
  AreaOfInterest,
}

export type AnchorEntityMap = {
  [AnchorType.Ped]: alt.Ped;
  [AnchorType.Player]: alt.Player;
  [AnchorType.Vehicle]: alt.Vehicle;
  [AnchorType.Tree]: alt.VirtualEntity;
  [AnchorType.Storage]: alt.VirtualEntity;
  [AnchorType.AreaOfInterest]: alt.VirtualEntity;
};
