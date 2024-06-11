import alt from "@altv/client";
import { div } from "../../renderer/rml-tags";
import { Icon } from "../../components/icon";

export function QuestNametag(ped: alt.Ped) {
  const name = ped.streamSyncedMeta.name;

  return div({
    class: "questNameTagContainer"
  }, [
    Icon("quest-ped", {
      sizePx: 32
    }),
    div({
      class: "questNameTagName"
    }, [name]),
    div({
      class: "questNameTagQuestAvailable"
    }, ["Quest Available"]),
    Icon("triangle-down", {
      class: "questNameTagIcon",
    }),
  ]);
}
