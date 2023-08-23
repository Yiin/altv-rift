import alt from "alt-server";
import { InGamePlayer } from "@/rpc/checks";

declare module "alt-server" {
  export interface Player {
    foo(this: InGamePlayer): void;
  }
}

// @ts-ignore
alt.Player.prototype.foo = function () {};
