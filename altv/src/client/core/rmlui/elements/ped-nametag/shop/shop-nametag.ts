import alt from "@altv/client";
import { div } from "../../../renderer/rml-tags";
import { Icon } from "../../../components/icon";

export function ShopNametag(ped: alt.Ped) {
  const summary = ped.streamSyncedMeta.summary;

  return div({
    class: "shopNameTagContainer"
  }, [
    Icon("store", {
      sizePx: 48
    }),
    div({
      class: "shopNameTagContent"
    }, [
      div({
        class: "shopNameTagTitle"
      }, ["Store"]),
      div({
        class: "shopNameTagSummary"
      }, [summary ?? "Food, tools and more"]),
    ]),
  ]);
}
