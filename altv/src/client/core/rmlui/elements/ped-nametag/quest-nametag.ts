import alt from "@altv/client";
import { div } from "../../renderer/rml-tags";
import { Icon } from "../../components/icon";
import { rem } from "../../renderer/pixel";

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
  ]);
}
