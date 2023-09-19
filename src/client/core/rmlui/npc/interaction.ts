import * as alt from "@altv/client";
import game from "@altv/natives";
import { Bones } from "@shared/enums/bones";
import { stopConversation } from "@/modules/questing/conversation";
import { registerElement } from "../renderer/element-registry";
import { div, span } from "../renderer/rml-tags";
import { Icon } from "../components/icon/icon";
import { AnchorType } from "../renderer/anchors";
import { useMenu } from "../renderer/hooks/use-menu";
import { everyFrame } from "../renderer/hooks/every-frame";

registerElement({
  key: "interaction",
  renderDistance: 3,
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
            const { x, y } = alt.worldToScreen(
              game.getPedBoneCoords(ped.scriptID, Bones.SKEL_Pelvis, 0, 0, 0.2)
            );
            return `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          }),
          opacity: menu.isActive ? 1 : 0.5,
        },
      },
      [
        div(
          {
            className: "interaction-content",
            style: {
              transform: everyFrame(({ scale }) => `scale(${scale})`),
            },
          },
          menu.interactions.map((interaction, index) =>
            div([
              div(
                {
                  className: ["interaction", currentMenuIndex === index && "interaction--selected"],
                },
                [Icon(interaction.icon), span({ className: "label" }, [interaction.label])]
              ),
            ])
          )
        ),
      ]
    );
  },
});
