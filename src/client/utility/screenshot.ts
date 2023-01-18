import { RPC } from "@shared/constants/rpcs";
import alt from "alt-client";
import rpc from "altv-rpc";
import { StringBuffer } from "../../shared/utility/buffer";

rpc.on(RPC.Client.SCREENSHOT_CREATE, async () => {
  const result = await alt.takeScreenshot();
  const data = StringBuffer.toBuffer(result);
  const totalLength = data.length;

  for (let i = 0; i < totalLength; i++) {
    rpc.triggerServer(RPC.Server.SCREENSHOT_POPULATE_DATA, {
      data: data[i],
      i,
      totalLength,
    });
  }
});
