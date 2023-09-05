import alt from "alt-client";
import game from "natives";
import { Bones } from "@shared/enums/bones";
import { div } from "../renderer/rml-tags";
import { AnchorType } from "../renderer/anchors";
import { registerElement } from "../renderer/element-registry";
import { everyFrame } from "../renderer/hooks/every-frame";

registerElement({
  key: "nametag",
  renderDistance: 25,
  anchorType: AnchorType.Ped,
  render({ entity: ped }) {
    const nametag = (ped.getStreamSyncedMeta("name") as string) ?? `?`;

    return div(
      {
        className: "nametag-wrapper",
        style: {
          transform: everyFrame(({ distance }) => {
            const headPos = game.getPedBoneCoords(
              ped.scriptID,
              Bones.SKEL_Head,
              0,
              0,
              // adjust z position based on distance
              Math.min((distance / 4) * 0.5 + 0.2, 0.5)
            );
            const { x, y } = alt.worldToScreen(headPos.x, headPos.y, headPos.z);
            return `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          }),
        },
      },
      [
        div(
          {
            className: "nametag",
            style: {
              transform: everyFrame(({ scale }) => `scale(${scale})`),
            },
          },
          [nametag]
        ),
      ]
    );
  },
});
