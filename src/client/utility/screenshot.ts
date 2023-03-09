import alt from "alt-client";
import { RPC } from "@shared/constants/rpcs";
import { Events } from "@shared/constants/events";
import { StringBuffer } from "../../shared/utility/buffer";

alt.onServer(Events.Client.SCREENSHOT_CREATE, async () => {
  const result = await alt.takeScreenshot();
  const data = StringBuffer.toBuffer(result);
  const totalLength = data.length;

  for (let i = 0; i < totalLength; i++) {
    alt.emitServerRaw(Events.Server.SCREENSHOT_POPULATE_DATA, {
      data: data[i],
      i,
      totalLength,
    });
  }
});
