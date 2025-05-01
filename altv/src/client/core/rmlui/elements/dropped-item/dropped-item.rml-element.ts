import alt from "@altv/client";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/core/rpc";
import { registerElement } from "../../renderer/element-registry";
import { div, img, span } from "../../renderer/rml-tags";
import { AnchorType } from "../../renderer/anchors";
import { useMenu } from "../../renderer/hooks/use-menu";
import { everyFrame } from "../../renderer/hooks/every-frame";
import { Icon } from "../../components/icon";
import { isInventoryFull } from "@shared/modules/inventory";
import { useCharacter } from "@/core/store/character.store";
import { getItemName } from "@shared/modules/items";
import { ItemGrade } from "@shared/modules/items";

const getItemGradeColor = (item: any) => {
  const grade = item?.grade;
  if (!grade || typeof grade !== "string") return "rgb(255, 255, 255)";

  return {
    [ItemGrade.COMMON]: "rgb(255, 255, 255)",
    [ItemGrade.UNCOMMON]: "rgb(185, 240, 69)",
    [ItemGrade.RARE]: "rgb(32, 135, 255)",
    [ItemGrade.EPIC]: "rgb(187, 44, 255)",
    [ItemGrade.LEGENDARY]: "rgb(255, 218, 87)",
    [ItemGrade.CONTRABAND]: "rgb(220, 0, 0)",
    [ItemGrade.LIMITED]: "rgb(0, 255, 234)",
  }[grade] ?? "rgb(255, 255, 255)";
};

function DroppedItemIndicator(grade: ItemGrade) {
  return div(
    {
      class: "indicator",
    },
    [
      div(
        {
          class: "indicator__glow-wrapper",
        },
        [
          img({
            class: "indicator__glow--dropped-item",
            src: "components/indicator/assets/dropped-item-indicator-glow.png",
          }),
        ],
      ),
      img({
        class: "indicator__dot",
        src: `components/indicator/assets/dropped-item-indicator-dot.png`,
      }),
    ],
  );
}

registerElement({
  key: "dropped-item",
  renderDistance: 15,
  anchorType: AnchorType.DroppedItem,
  focusable: true,
  render({ entity: ve }) {
    const menu = useMenu(
      isInventoryFull(useCharacter().inventory) || !ve.reactiveStreamSyncedMeta.item
        ? []
        : [{ text: getItemName(ve.reactiveStreamSyncedMeta.item.key), value: "pick-up" }],
      {
        async onSelect(interaction) {
          if (interaction.value === "pick-up") {
            await rpc.callServer(ServerCall.FromClient.PICK_UP_ITEM, ve.remoteID);
          }
        },
        drawDistance: 4,
      },
    );

    const currentMenuIndex = menu.currentIndex();

    return div(
      {
        class: "interaction-wrapper",
        style: {
          transform: everyFrame(({ pos }) => {
            const { x, y } = alt.worldToScreen(pos);
            return `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          }),
          display: "block",
        },
      },
      [
        // @ts-expect-error - we don't care about type "correctness" here
        DroppedItemIndicator(ve.reactiveStreamSyncedMeta.item?.grade || ItemGrade.COMMON),
        div(
          {
            class: "interaction-content",
            style: {
              transform: `translate(55px, -47px)`,
              opacity: everyFrame(({ distance }) => (distance < 8 ? 1 : 0)),
            },
          },
          [
            ...menu.interactions.map((interaction, index) =>
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
                      sizePx: 24,
                    }),
                    div([
                      div(
                        {
                          class: [
                            "interaction",
                            currentMenuIndex === index && "interaction--selected",
                          ],
                        },
                        [
                          span(
                            {
                              class: "dropped-item-label",
                              style: {
                                color: getItemGradeColor(ve.reactiveStreamSyncedMeta.item),
                              },
                            },
                            [
                              // @ts-expect-error - we don't care about type "correctness" here
                              `${ve.reactiveStreamSyncedMeta.item?.amount ?? 1} x ${interaction.text}`,
                            ],
                          ),
                        ],
                      ),
                    ]),
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
