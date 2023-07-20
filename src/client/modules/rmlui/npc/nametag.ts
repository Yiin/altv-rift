import alt from "alt-client";
import game from "natives";
import { Bones } from "@shared/enums/bones";
import { div } from "../renderer/nodes";
import { AnchorType, registerElement } from "./elements";

registerElement({
  key: "nametag",
  renderDistance: 25,
  anchorType: AnchorType.Ped,
  render({ ped, scale }) {
    const nametag = (ped.getStreamSyncedMeta("Name") as string) ?? `?`;

    const headPos = game.getPedBoneCoords(
      ped.scriptID,
      Bones.SKEL_Head,
      0,
      0,
      0
    );
    const { x: screenX, y: screenY } = alt.worldToScreen(
      headPos.x,
      headPos.y,
      headPos.z + Math.min((ped.frameData.distance / 4) * 0.5 + 0.2, 0.5)
    );

    return div(
      ".nametag-wrapper",
      {
        style: {
          transform: `translate(-50%, -50%) translate(${screenX}px, ${screenY}px)`,
        },
      },
      [
        div(
          ".nametag",
          {
            style: {
              transform: `scale(${scale})`,
            },
          },
          [nametag]
        ),
      ]
    );
  },
});
