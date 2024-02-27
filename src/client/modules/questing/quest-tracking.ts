import { ClientEvents } from "@shared/events/client";
import { useWebview } from "@/core/user-interface/webview";
import { clientState } from "@/core/store/client.store";
import { getQuestTask } from "./lib/register-quest";

let cleanupPreviousTracking: (() => void) | void;

useWebview((webview) => {
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
