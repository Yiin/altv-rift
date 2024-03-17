import alt from "@altv/client";
import game from "@altv/natives";
import { computed, ComputedRef, watch } from "vue";
import { PedInteraction } from "@shared/modules/ped/interactions";
import { IconName } from "@/core/rmlui/components/icon";
import { clientState } from "@/core/store/client.store";
import { getPedInteractions } from "./lib/register-ped-interactions";

declare module "@altv/client" {
  export interface Ped {
    interactions: ComputedRef<PedInteraction<IconName>[]>;
    blip?: alt.Blip["scriptID"];
    cleanupFns: (() => void)[];
  }
}

alt.Events.onGameEntityCreate(({ entity }) => {
  if (!(entity instanceof alt.Ped)) {
    return;
  }

  alt.log("Ped created", entity.id);

  entity.cleanupFns = [];

  const key = entity.streamSyncedMeta.key;

  if (!key) {
    alt.log("Ped has no key");
    return;
  }

  alt.log("Registering interactions for ped", key);

  /**
   * How can we interact with this ped?
   * USING MENU ITEMS
   * interactions are these menu items
   */
  entity.interactions = computed(() =>
    getPedInteractions(key)
      .map((registration) => registration(entity))
      .flat(),
  );
  entity.cleanupFns.push(() => {
    entity.interactions.effect.stop();
  });

  /**
   * How can we see interactable peds on the map?
   * USING BLIPS
   * so we create the blips based on interactions of this ped
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
        entity.blip = game.addBlipForEntity(entity);
        game.setBlipSprite(entity.blip, 456); // alt.Enums.BlipSprite.FINDERS_KEEPERS
      }

      // Set the blip color based on if we are tracking the quest task this ped is responsible for
      const trackingSameQuest = interactions.some(
        (interaction) => interaction.key === clientState.trackingQuest,
      );
      if (trackingSameQuest) {
        game.setBlipColour(entity.blip, alt.Enums.BlipColor.YELLOW_ORANGE);
      } else {
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
