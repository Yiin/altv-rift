import alt from "@altv/client";
import { WindowType } from "@shared/store/client.store";
import { StorageType } from "@shared/store/game-state.store";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/core/rpc";
import { openWindow } from "@/core/user-interface/webview";
import { isAirDropInPosition } from "@/modules/inventory";
import { registerElement } from "../../renderer/element-registry";
import { div, span } from "../../renderer/rml-tags";
import { AnchorType } from "../../renderer/anchors";
import { useMenu } from "../../renderer/hooks/use-menu";
import { everyFrame } from "../../renderer/hooks/every-frame";
import { Indicator } from "../../components/indicator";
import { Icon } from "../../components/icon";
import { rem } from "../../renderer/pixel";
import { gameState } from "@/core/store/game-state.store";

registerElement({
  key: "storage-interaction",
  renderDistance: 15,
  anchorType: AnchorType.Storage,
  focusable: true,
  render({ entity: ve }) {
    const isLootBox = [StorageType.AirDrop, StorageType.LootBox].includes(
      ve.streamSyncedMeta.storageType,
    );
    const isShop = ve.streamSyncedMeta.storageType === StorageType.Shop;

    const label = isShop ? "Shop" : "Open";

    const menu = useMenu([{ text: label, value: "open-storage" }], {
      async onSelect(interaction) {
        if (interaction.value === "open-storage") {
          const canOpen = await rpc.callServer(ServerCall.FromClient.OPEN_STORAGE, ve.remoteID);

          if (canOpen) {
            await alt.Utils.waitFor(() => !!gameState.openedStorage);

            if (isLootBox) {
              openWindow(WindowType.LOOT_BOX);
            } else if (isShop) {
              console.log(ve.streamSyncedMeta.windowType, ve.streamSyncedMeta.storageType);
              if (ve.streamSyncedMeta.windowType === WindowType.CLOTHING_SHOP) {
                openWindow(WindowType.CLOTHING_SHOP);
              } else {
                openWindow(WindowType.SHOP);
              }
            } else {
              openWindow(WindowType.STORAGE);
            }
          }
        }
      },
      drawDistance: 3,
    });

    const currentMenuIndex = menu.currentIndex();

    if (!menu.interactions.length) {
      return null;
    }

    return div(
      {
        class: "interaction-wrapper",
        style: {
          transform: everyFrame(({ pos }) => {
            const { x, y } = alt.worldToScreen(pos);
            return `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          }),
          display: everyFrame(() => (isAirDropInPosition(ve) ? "block" : "none")),
        },
      },
      [
        div([Indicator()]),
        div(
          {
            class: "interaction-content",
            style: {
              transform: `translate(55px, -47px)`,
              opacity: everyFrame(() => (menu.isActive ? 1 : 0)),
            },
          },
          [
            ...menu.interactions.map((interaction, index, arr) =>
              div([
                div(
                  {
                    style: {
                      width: "20rem",
                      display: "flex",
                      "align-items": "center",
                      "justify-content": "flex-start",
                      gap: "5px",
                    },
                  },
                  [
                    Icon("key-E", {
                      style: {
                        display: currentMenuIndex === index ? "block" : "none",
                      },
                      sizePx: 32,
                    }),
                    div([
                      div(
                        {
                          class: [
                            "interaction",
                            currentMenuIndex === index && "interaction--selected",
                          ],
                        },
                        [span({ class: "label" }, [interaction.text])],
                      ),
                    ]),
                    Icon("mouse-wheel", {
                      style: {
                        display: currentMenuIndex === index && arr.length > 1 ? "block" : "none",
                        width: rem(24),
                        height: rem(24 * (456 / 256)),
                      },
                    }),
                  ],
                ),
              ]),
            ),
          ],
        ),
      ],
    );
  },
});
