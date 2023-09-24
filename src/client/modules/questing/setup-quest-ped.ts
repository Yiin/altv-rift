import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { computed, ComputedRef, watch } from "vue";
import { NpcInteraction } from "@shared/modules/npc/interactions";
import { IconName } from "@/core/rmlui/components/icon/icon";
import { clientState } from "@/core/store/client.store";
import { getNpcInteractions } from "./lib/register-npc-interactions";

declare module "@altv/client" {
  export interface Ped {
    interactions: ComputedRef<NpcInteraction<IconName>[]>;
    blip?: alt.Blip["scriptID"];
    cleanupFns: (() => void)[];
  }
}

alt.Events.onGameEntityCreate(({ entity }) => {
  if (!(entity instanceof alt.Ped)) {
    return;
  }

  entity.cleanupFns = [];

  const key = entity.streamSyncedMeta.key;

  if (!key) {
    return;
  }

  /**
   * How can we interact with this npc?
   * USING MENU ITEMS
   * interactions are these menu items
   */
  entity.interactions = computed(() =>
    getNpcInteractions(key)
      .map((registration) => registration(entity))
      .flat()
  );
  entity.cleanupFns.push(() => {
    entity.interactions.effect.stop();
  });

  /**
   * How can we see interactable npcs on the map?
   * USING BLIPS
   * so we create the blips based on interactions of this npc
   */
  const stopBlipWatch = watch([entity.interactions, clientState], ([interactions]) => {
    if (!interactions.length) {
      if (entity.blip) {
        // Remove the blip if there are no more interactions with it
        game.removeBlip(entity.blip);
        entity.blip = undefined;
      }
    } else {
      // Create the blip if one doesn't exist yet
      if (!entity.blip) {
        entity.blip = game.addBlipForEntity(entity.scriptID);
        game.setBlipSprite(entity.blip, alt.Enums.BlipSprite.FINDERS_KEEPERS);
      }

      // Set the blip color based on if we are tracking the quest task this npc is responsible for
      const trackingSameQuest = interactions.some(
        (interaction) => interaction.key === clientState.trackingQuest
      );
      if (trackingSameQuest) {
        alt.log("Setting yellow orange");
        game.setBlipColour(entity.blip, alt.Enums.BlipColor.YELLOW_ORANGE);
      } else {
        alt.log("Setting white");
        game.setBlipColour(entity.blip, alt.Enums.BlipColor.WHITE);
      }
    }
  });
  entity.cleanupFns.push(() => {
    stopBlipWatch();
    if (entity.blip) {
      game.removeBlip(entity.blip);
    }
  });
});

alt.Events.onGameEntityDestroy(({ entity }) => {
  if (!(entity instanceof alt.Ped)) {
    return;
  }

  entity.cleanupFns.forEach((fn) => fn());
});
