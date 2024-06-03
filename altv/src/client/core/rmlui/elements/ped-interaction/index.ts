import alt from "@altv/client";
import { stopConversation } from "@/modules/questing/conversation";
import { registerElement } from "../../renderer/element-registry";
import { div, span } from "../../renderer/rml-tags";
import { Icon } from "../../components/icon";
import { AnchorType } from "../../renderer/anchors";
import { useMenu } from "../../renderer/hooks/use-menu";
import { everyFrame } from "../../renderer/hooks/every-frame";
import { px, rem } from "../../renderer/pixel";
import { Indicator } from "../../components/indicator";

registerElement({
  key: "ped-interaction",
  renderDistance: 15,
  anchorType: AnchorType.Ped,
  focusable: true,
  render({ entity: ped }) {
    const interactions = ped.interactions?.value ?? [];

    const menu = useMenu(interactions, {
      onSelect(interaction) {
        interaction.onSelect();
      },
      onLeave() {
        stopConversation();
      },
      drawDistance: 2.5,
    });

    const currentMenuIndex = menu.currentIndex();

    if (!menu.interactions.length) {
      return null;
    }

    return div(
      {
        className: "interaction-wrapper",
        style: {
          transform: everyFrame(() => {
            const { x, y } = alt.worldToScreen(ped.pos);
            return `translate(${rem(x - 25)}, ${rem(y - 25)})`;
          }),
          opacity: menu.isActive ? 1 : 0.5
        },
      },
      [
        div([Indicator()]),
        div(
          {
            className: "interaction-content",
            style: {
              transform: `translate(${rem(55)}, ${rem(-47)})`,
              opacity: everyFrame(() => (menu.isActive ? 1 : 0)),
            },
          },
          menu.interactions.map((interaction, index, arr) =>
            div([
              div(
                {
                  style: {
                    width: rem(320),
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "flex-start",
                    gap: rem(5),
                  },
                },
                [
                  div([
                    div(
                      {
                        className: ["interaction", currentMenuIndex === index && "interaction--selected"],
                      },
                      [
                        currentMenuIndex === index
                          ? Icon("key-E", { sizePx: 32 })
                          : Icon(interaction.icon),
                        span({
                          className: "label"
                        }, [interaction.label])
                      ],
                    )
                  ]),
                  Icon("mouse-wheel", {
                    style: {
                      'display': currentMenuIndex === index && arr.length > 1 ? 'block' : 'none',
                      width: rem(24),
                      height: rem(24 * (456 / 256)),
                    }
                  })
                ],
              ),
            ]),
          ),
        ),
      ],
    );
  },
});
