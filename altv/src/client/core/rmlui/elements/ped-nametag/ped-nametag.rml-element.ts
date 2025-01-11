import alt from "@altv/client";
import game from "@altv/natives";
import { PedBone } from "@shared/enums/bones";
import { PedFlags } from "@shared/modules/ped";
import { div } from "../../renderer/rml-tags";
import { AnchorType } from "../../renderer/anchors";
import { registerElement } from "../../renderer/element-registry";
import { everyFrame } from "../../renderer/hooks/every-frame";
import { isQuestPed } from "@/modules/peds/lib/is-quest-ped";
import { QuestNametag } from "./quest/quest-nametag";
import { px, rem } from "../../renderer/pixel";
import { EnemyNametag } from "./enemy/enemy-nametag";
import { isShopPed } from "@/modules/peds/lib/is-shop-ped";
import { ShopNametag } from "./shop/shop-nametag";

registerElement({
  key: "ped-nametag",
  renderDistance: 40,
  anchorType: AnchorType.Ped,
  render({ entity: ped }) {
    const name = ped.streamSyncedMeta.name ?? `Ped (#${ped.scriptID})`;
    const flags = ped.streamSyncedMeta.flags;
    const isEnemy = typeof flags !== 'undefined' && !(flags & PedFlags.Peaceful);
    const isQuest = isQuestPed(ped);
    const isShop = isShopPed(ped);

    return div(
      { class: "pedNameTagContainer" },
      [
        div(
          {
            class: "pedNameTag",
            style: {
              transform: everyFrame(() => {
                const headPos = game.getPedBoneCoords(
                  ped,
                  PedBone.SKEL_Head,
                  0.4, 0, 0
                );
                const { x, y } = alt.worldToScreen({ x: ped.pos.x, y: ped.pos.y, z: headPos.z });

                // from .pedNameTag class
                const width = 200;
                const height = 300;
                const translateX = width / 2;
                const translateY = height;

                return `translate(${x - px(translateX)}px, ${y - px(translateY)}px)`;
              }),
            },
          },
          [
            div(
              {
                class: "pedNameTagContent",
                style: {
                  transform: everyFrame(({ scale }) => `scale(${scale})`),
                },
              },
              [
                isQuest
                  ? QuestNametag(ped)
                  : isEnemy
                    ? EnemyNametag(ped)
                    : isShop
                      ? ShopNametag(ped)
                      : div({
                        class: "questNameTagContainer"
                      }, [
                        div({
                          class: "questNameTagName"
                        }, [name]),
                      ]),
              ],
            ),
          ],
        )
      ]);
  },
});
