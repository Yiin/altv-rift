import alt from "alt-client";

export enum AnchorType {
  Ped,
}

export type AnchorEntityMap = {
  [AnchorType.Ped]: alt.Ped;
};
