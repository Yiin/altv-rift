import * as alt from "@altv/client";
import { ClientEvents } from "@shared/events/client";
import { ServerEvents } from "@shared/events/server";
import { StringBuffer } from "@shared/utility/buffer";

alt.Events.onServer(ClientEvents.FromServer.SCREENSHOT_CREATE, async () => {
  const result = await alt.takeScreenshot();
  const data = StringBuffer.toBuffer(result);
  const totalLength = data.length;

  for (let i = 0; i < totalLength; i++) {
    alt.Events.emitServerRaw(ServerEvents.FromClient.SCREENSHOT_POPULATE_DATA, {
      data: data[i],
      i,
      totalLength,
    });
  }
});
