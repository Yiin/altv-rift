import { ClientEvents } from "@shared/events/client";
import { getWebview } from "@/core/user-interface/webview";
import { clientState } from "@/core/store/client.store";
import { getQuestTask } from "./lib/register-quest";

let cleanupPreviousTracking: (() => void) | void;

getWebview((webview) => {
  webview.on(ClientEvents.FromWebview.TRACK_QUEST, (questFact: string) => {
    const questTask = getQuestTask(questFact);

    if (!questTask) {
      return;
    }

    if (cleanupPreviousTracking) {
      cleanupPreviousTracking();
    }

    cleanupPreviousTracking = questTask.track?.();
    clientState.trackingQuest = questFact;
  });
});
