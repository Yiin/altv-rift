import alt from "alt-client";
import game from "natives";
import { Bones } from "@shared/enums/bones";
import { stopConversation } from "@/modules/questing/dialogue";
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

    if (!menu.interactions.length) {
      return null;
    }

    const transform = everyFrame(() => {
      const lowerBodyPos = game.getPedBoneCoords(ped.scriptID, Bones.SKEL_Pelvis, 0, 0, 0.2);
      const { x: screenX, y: screenY } = alt.worldToScreen(
        lowerBodyPos.x,
        lowerBodyPos.y,
        lowerBodyPos.z
      );
      return `translate(-50%, -50%) translate(${screenX}px, ${screenY}px)`;
    });

    const scale = everyFrame(({ scale }) => `scale(${scale})`);

    return div(
      {
        className: "interaction-wrapper",
        style: {
          transform,
          opacity: menu.isActive ? 1 : 0.5,
        },
      },
      [
        div(
          {
            className: "interaction-content",
            style: {
              transform: scale,
            },
          },
          menu.interactions.map((interaction, index) =>
            div([
              div(
                {
                  className: [
                    "interaction",
                    menu.currentIndex() === index && "interaction--selected",
                  ],
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
