import * as alt from "@altv/client";
import game from "@altv/natives";
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
    const nametag = ped.streamSyncedMeta.name ?? `?`;

    return div(
      {
        className: "nametag-wrapper",
        style: {
          transform: everyFrame(({ distance }) => {
            const { x, y } = alt.worldToScreen(
              game.getPedBoneCoords(
                ped.scriptID,
                Bones.SKEL_Head,
                // adjust z position based on distance
                Math.min((distance / 4) * 0.5 + 0.2, 0.5),
                0,
                0
              )
            );
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
