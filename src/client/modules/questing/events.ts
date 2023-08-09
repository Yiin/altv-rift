import alt from "alt-client";
import { computed, ComputedRef } from "vue";
import { NpcInteraction } from "@shared/modules/npc/interactions";
import { IconName } from "../rmlui/components/icon/icon";
import { getNpcInteractions } from "./register-npc-interactions";

declare module "alt-client" {
  export interface Ped {
    interactions?: ComputedRef<NpcInteraction<IconName>[]>;
  }
}

alt.on("gameEntityDestroy", (entity) => {
  if (!(entity instanceof alt.Ped)) {
    return;
  }

  // just in case
  delete entity.interactions;
});

alt.on("gameEntityCreate", (entity) => {
  if (!(entity instanceof alt.Ped)) {
    return;
  }

  const key = entity.getStreamSyncedMeta("key");

  if (!key) {
    return;
  }

  const interactionRegistrations = getNpcInteractions(key);

  if (!interactionRegistrations) {
    return;
  }

  if (interactionRegistrations) {
    entity.interactions = computed(() =>
      interactionRegistrations
        .map((registration) => registration(entity))
        .flat()
    );
  }
});
