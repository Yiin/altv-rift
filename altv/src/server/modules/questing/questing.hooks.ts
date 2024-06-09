import { InGamePlayer } from "@/core/utility/assertions";
import { createHookableFunction } from "@shared/hooks";

export const processQuestFact = createHookableFunction<(player: InGamePlayer, questFact: string) => boolean>({
  name: "processQuestFact",
  defaultReturn: false,
});
