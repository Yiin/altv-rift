import alt from "@altv/client";
import { WindowType } from "@shared/store/client.store";
import { StorageType } from "@shared/store/game-state.store";
import { ServerCall } from "@shared/calls/server";
import { clientState } from "@/core/store/client.store";
import { rpc } from "@/core/rpc";
import { openWindow } from "@/core/user-interface/webview";
import { isAirDropInPosition } from "@/modules/inventory";
import { registerElement } from "../../renderer/element-registry";
import { div, span } from "../../renderer/rml-tags";
import { AnchorType } from "../../renderer/anchors";
import { useMenu } from "../../renderer/hooks/use-menu";
import { everyFrame } from "../../renderer/hooks/every-frame";
import { Indicator } from "../../components/indicator";

registerElement({
  key: "storage-interaction",
  renderDistance: 15,
  anchorType: AnchorType.Storage,
  focusable: true,
  render({ entity: ve }) {
    const menu = useMenu([
      { text: "Open", value: "open" },
    ], {
      async onSelect(interaction) {
        if (interaction.value === "open") {
          if (ve.streamSyncedMeta.storageType === StorageType.AirDrop) {
            const canOpen = await rpc.callServer(ServerCall.FromClient.OPEN_STORAGE, ve.remoteID);

            await alt.Utils.wait(100);

            if (canOpen) {
              openWindow(WindowType.LOOT_BOX);
            }
          }
        }
      },
      drawDistance: 2
    });

    const currentMenuIndex = menu.currentIndex();

    if (!menu.interactions.length) {
      return null;
    }

    return div(
      {
        className: "interaction-wrapper",
        style: {
          transform: everyFrame(({ pos }) => {
            const { x, y } = alt.worldToScreen(pos);
            return `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          }),
          display: everyFrame(() => isAirDropInPosition(ve) ? "block" : "none"),
        },
      },
      [
        div([
          Indicator()
        ]),
        div(
          {
            className: "interaction-content",
            style: {
              transform: `translate(55px, -47px)`,
              opacity: everyFrame(() => menu.isActive ? 1 : 0),
            },
          },
          [
            ...menu.interactions.map((interaction, index) =>
              div([
                div({
                  style: {
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    gap: "5px",
                  }
                }, [
                  div([
                    div(
                      {
                        className: ["interaction", "interaction--storage", currentMenuIndex === index && "interaction--selected"],
                      },
                      [span({ className: "label" }, [interaction.text])]
                    )
                  ]),
                ])
              ])
            )
          ]
        ),
      ]
    );
  },
});
