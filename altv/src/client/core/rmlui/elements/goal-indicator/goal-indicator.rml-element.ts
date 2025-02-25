import alt from "@altv/client";
import { registerElement } from "../../renderer/element-registry";
import { div, img } from "../../renderer/rml-tags";
import { AnchorType } from "../../renderer/anchors";
import { everyFrame } from "../../renderer/hooks/every-frame";
import { px } from "../../renderer/pixel";

registerElement({
  key: "goal-indicator",
  renderDistance: (distance) => distance < 100 && distance > 15,
  anchorType: AnchorType.AreaOfInterest,
  render({ entity: interest }) {
    return div(
      {
        class: "goal-indicator-wrapper",
        style: {
          transform: everyFrame(() => {
            const { x, y } = alt.worldToScreen(interest.pos);
            return `translate(${x - px(25)}px, ${y - px(25)}px)`;
          }),
        },
      },
      [
        div(
          {
            class: "goal-indicator",
          },
          [
            img({
              class: "goal-indicator__outline",
              src: `elements/goal-indicator/assets/target-outline.png`,
            }),
            div(
              {
                class: "goal-indicator__area-name",
              },
              [interest.reactiveStreamSyncedMeta.areaName],
            ),
            div(
              {
                class: "goal-indicator__area-description",
              },
              [interest.reactiveStreamSyncedMeta.areaDescription],
            ),
          ],
        ),
      ],
    );
  },
});
