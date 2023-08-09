import alt from "alt-client";
import game from "natives";
import { Bones } from "@shared/enums/bones";
import { div } from "../renderer/rml-tags";
import { AnchorType } from "../renderer/anchors";
import { registerElement } from "../renderer/element-registry";

registerElement({
  key: "nametag",
  renderDistance: 25,
  anchorType: AnchorType.Ped,
  render({ entity: ped, scale, distance }) {
    const nametag = (ped.getStreamSyncedMeta("name") as string) ?? `?`;

    const headPos = game.getPedBoneCoords(ped.scriptID, Bones.SKEL_Head, 0, 0, 0);
    const { x: screenX, y: screenY } = alt.worldToScreen(
      headPos.x,
      headPos.y,
      // adjust z position based on distance
      headPos.z + Math.min((distance / 4) * 0.5 + 0.2, 0.5)
    );

    return div(
      {
        className: "nametag-wrapper",
        style: {
          transform: `translate(-50%, -50%) translate(${screenX}px, ${screenY}px)`,
        },
      },
      [
        div(
          {
            className: "nametag",
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
