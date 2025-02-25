import alt from "@altv/client";
import { registerElement } from "../../renderer/element-registry";
import { div, img } from "../../renderer/rml-tags";
import { AnchorType } from "../../renderer/anchors";
import { everyFrame } from "../../renderer/hooks/every-frame";
import { px } from "../../renderer/pixel";

registerElement({
  key: "objective-indicator",
  renderDistance: (distance) => distance < 100 && distance > 15,
  anchorType: AnchorType.AreaOfInterest,
  render({ entity: interest }) {
    return div(
      {
        class: "objective-indicator-wrapper",
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
            class: "objective-indicator",
          },
          [
            img({
              class: "objective-indicator__outline",
              src: `elements/objective-indicator/assets/target-outline.png`,
            }),
            div(
              {
                class: "objective-indicator__area-name",
              },
              [interest.reactiveStreamSyncedMeta.areaName],
            ),
            div(
              {
                class: "objective-indicator__area-description",
              },
              [interest.reactiveStreamSyncedMeta.areaDescription],
            ),
          ],
        ),
      ],
    );
  },
});
