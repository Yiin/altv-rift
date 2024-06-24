import alt from "@altv/client";
import { PedFlags } from "@shared/modules/ped";

export function isShopPed(ped: alt.Ped) {
  return (ped.streamSyncedMeta.flags ?? 0) & PedFlags.ShopKeeper;
}
