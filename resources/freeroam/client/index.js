"use strict";
/// <reference path="typings/altv-client.d.ts"/>
/// <reference path="typings/natives.d.ts"/>
import * as alt from "alt-client";
import * as game from "natives";

alt.onServer("freeroam:spawned", () => {
  game.setPedDefaultComponentVariation(alt.Player.local.scriptID);
});
