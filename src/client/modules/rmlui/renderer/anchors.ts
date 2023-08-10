import alt from "alt-client";

export enum AnchorType {
  Ped,
  Player,
  Tree,
}

export type AnchorEntityMap = {
  [AnchorType.Ped]: alt.Ped;
  [AnchorType.Player]: alt.Player;
  [AnchorType.Tree]: alt.VirtualEntity;
};
