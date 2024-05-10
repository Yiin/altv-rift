import alt from "@altv/client";
import game from "@altv/natives";
import { Bones } from "@shared/enums/bones";
import { PED_HEALTH_ZERO, PedFlags } from "@shared/modules/ped";
import { br, div } from "../../renderer/rml-tags";
import { AnchorType } from "../../renderer/anchors";
import { registerElement } from "../../renderer/element-registry";
import { everyFrame } from "../../renderer/hooks/every-frame";

registerElement({
  key: "ped-nametag",
  renderDistance: 50,
  anchorType: AnchorType.Ped,
  render({ entity: ped }) {
    const nametag = ped.streamSyncedMeta.name;
    const flags = ped.streamSyncedMeta.flags ?? 0;
    const isEnemy = !(flags & PedFlags.Peaceful);

    const health = () => Math.max(0, ped.health - PED_HEALTH_ZERO);
    const maxHealth = () => ped.maxHealth - PED_HEALTH_ZERO;

    return div(
      {
        style: {
          position: "absolute",
          "text-align": "center",
          transform: everyFrame(() => {
            const headPos = game.getPedBoneCoords(
              ped,
              Bones.SKEL_Head,
              // adjust z position based on distance
              0.4,
              0,
              0,
            );
            const { x, y } = alt.worldToScreen({ x: ped.pos.x, y: ped.pos.y, z: headPos.z });
            return `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          }),
        },
      },
      [
        div(
          {
            style: {
              "transform-origin": "center center",
              transform: everyFrame(({ scale }) => `scale(${scale})`),
            },
          },
          [
            ...(nametag
              ? [
                  div(
                    {
                      style: {
                        "font-effect": "outline(2px black)",
                        "font-style": "normal",
                        "font-size": "30pt",
                        color: "white",
                      },
                    },
                    [nametag],
                  ),
                  br([]),
                ]
              : []),
            // Health bar
            isEnemy &&
              div([
                div(
                  {
                    style: {
                      color: "white",
                      "font-family": "josefinsans-semibold",
                      "font-style": "normal",
                      "font-size": "20pt",
                      "font-effect": "outline(1px black)",
                      transform: `translateY(-4px)`,
                    },
                  },
                  // [everyFrame(() => (ped.health ? (ped.health).toFixed(0) : "Dead"))],
                  [everyFrame(() => `${Math.max(0, health())} / ${maxHealth()}`)],
                ),
                br([]),
                div(
                  {
                    style: {
                      transform: `translateY(-50%)`,
                      display: "block",
                      background: "rgb(120, 0, 0)",
                      border: "3px black",
                      opacity: "1",
                      width: "120px",
                      height: "8px",
                    },
                  },
                  [
                    div({
                      style: {
                        display: "block",
                        width: everyFrame(() => `${(health() / maxHealth()) * 100 || 0}%`),
                        height: "8px",
                        background: "rgb(255, 50, 50)",
                      },
                    }),
                  ],
                ),
              ]),
          ],
        ),
      ],
    );
  },
});
