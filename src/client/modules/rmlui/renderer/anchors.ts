import alt from "alt-client";
import { TreeData } from "@/modules/woodcutting/trees/nearby-trees";

export enum AnchorType {
  Ped,
  Player,
  Tree,
}

export type AnchorEntityMap = {
  [AnchorType.Ped]: alt.Ped;
  [AnchorType.Player]: alt.Player;
  [AnchorType.Tree]: TreeData;
};
