import * as alt from "@altv/server";
import { StringBuffer } from "@shared/utility/buffer";
import { ServerEvents } from "@shared/events/server";
import { ClientEvents } from "@shared/events/client";
import { ServerEventsFromClient } from "@shared/events/server/from-client";

const MAX_TRIES = 1000;
const pendingScreenshots: {
  [key: string]: {
    data: Array<string>;
    didComplete: boolean;
  };
} = {};

export class Screenshot {
  /**
   * Take a screenshot of the player screen.
   * If the data becomes corrupted or does not retrieve in time it will return null.
   *
   * @static
   * @param {alt.Player} player
   * @return {(Promise<string | null>)}
   * @memberof AthenaScreenshot
   */
  static async takeScreenshot(player: alt.Player): Promise<string | null> {
    player.emit(ClientEvents.FromServer.SCREENSHOT_CREATE);

    return new Promise((resolve: Function) => {
      let tries = 0;

      const interval = alt.Timers.setInterval(() => {
        tries += 1;

        if (tries > MAX_TRIES) {
          interval.destroy();
          delete pendingScreenshots[player.id];
          return resolve(null);
        }

        if (!pendingScreenshots[player.id] || !pendingScreenshots[player.id].didComplete) {
          return;
        }

        interval.destroy();
        const fullData = StringBuffer.fromBuffer(pendingScreenshots[player.id].data);
        delete pendingScreenshots[player.id];
        return resolve(fullData);
      }, 100);
    });
  }

  /**
   * Builds data from a screenshot event.
   */
  static async buildData(
    player: alt.Player,
    { data, i, totalLength }: { data: string; i: number; totalLength: number }
  ) {
    if (!pendingScreenshots[player.id]) {
      pendingScreenshots[player.id] = {
        data: new Array(totalLength),
        didComplete: false,
      };
    }

    pendingScreenshots[player.id].data[i] = data;

    if (i === totalLength - 1) {
      pendingScreenshots[player.id].didComplete = true;
    }
  }
}

alt.Events.onPlayer(ServerEventsFromClient.SCREENSHOT_POPULATE_DATA, Screenshot.buildData);
