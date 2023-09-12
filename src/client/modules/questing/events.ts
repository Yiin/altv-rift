import * as alt from "@altv/client";
import { computed, ComputedRef } from "vue";
import { NpcInteraction } from "@shared/modules/npc/interactions";
import { IconName } from "@/core/rmlui/components/icon/icon";
import { getNpcInteractions } from "./register-npc-interactions";

declare module "@altv/client" {
  export interface Ped {
    interactions?: ComputedRef<NpcInteraction<IconName>[]>;
  }
}

alt.Events.onGameEntityDestroy(({ entity }) => {
  if (!(entity instanceof alt.Ped)) {
    return;
  }

  // just in case
  delete entity.interactions;
});

alt.Events.onGameEntityCreate(({ entity }) => {
  if (!(entity instanceof alt.Ped)) {
    return;
  }

  const key = entity.streamSyncedMeta.key;

  if (!key) {
    return;
  }

  const interactionRegistrations = getNpcInteractions(key);

  if (!interactionRegistrations) {
    return;
  }

  if (interactionRegistrations) {
    entity.interactions = computed(() =>
      interactionRegistrations.map((registration) => registration(entity)).flat()
    );
  }
});
