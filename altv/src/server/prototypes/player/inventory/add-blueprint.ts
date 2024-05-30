import alt from "@altv/server";
import { BlueprintKey } from "@shared/modules/production/types";
import { InGamePlayer } from "@/core/utility/assertions";

declare module "@altv/server" {
  export interface Player {
    addBlueprint(this: InGamePlayer, blueprintKey: BlueprintKey): void;
  }
}

alt.Player.prototype.addBlueprint = function (blueprint) {
  this.character.blueprints.push(blueprint);
};
