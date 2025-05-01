import alt from "@altv/client";
import { div } from "../../renderer/rml-tags";
import { AnchorType } from "../../renderer/anchors";
import { registerElement } from "../../renderer/element-registry";
import { everyFrame } from "../../renderer/hooks/every-frame";
import { Icon } from "../../components/icon";

registerElement({
  key: "marker",
  renderDistance: () => true,
  anchorType: AnchorType.Marker,
  render({ entity: marker }) {
    const { r, g, b } = marker.reactiveStreamSyncedMeta.color ?? { r: 255, g: 255, b: 255 };

    return div(
      {
        class: "marker-wrapper",
        style: {
          transform: everyFrame(() => {
            const { x, y } = alt.worldToScreen(marker.pos.add(0, 0, 1));
            return `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          }),
        }, //
      },
      [
        div(
          {
            class: "marker",
            style: {
              display: 'flex',
              'align-items': 'center',
              width: '400px',
            }
          },
          [
            Icon(marker.reactiveStreamSyncedMeta.icon ?? "key-E"),
            div([
              div({
                style: {
                  display: 'flex',
                  'flex-direction': 'column',
                  width: '300px'
                }
              },
                [
                  div({ class: "marker-label", style: { 'font-size': '16pt', color: `rgb(${r}, ${g}, ${b})` } }, [marker.reactiveStreamSyncedMeta.label]),
                  div({ class: "marker-description" }, [marker.reactiveStreamSyncedMeta.description]),
                ]),
            ]),
          ]
        )
      ],
    );
  },
});
