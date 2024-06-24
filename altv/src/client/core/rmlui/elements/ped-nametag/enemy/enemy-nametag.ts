import alt from "@altv/client";
import { br, div } from "../../../renderer/rml-tags";
import { everyFrame } from "../../../renderer/hooks/every-frame";

export function EnemyNametag(ped: alt.Ped) {
  const name = ped.streamSyncedMeta.name ?? "Thug";
  const health = () => Math.max(0, ped.streamSyncedMeta.health);
  const maxHealth = () => ped.streamSyncedMeta.maxHealth;

  return div([
    div(
      {
        class: "nameTagContainer",
      },
      [name],
    ),
    br([]),
    div(
      {
        class: "healthBarContainer",
      },
      [
        div({
          class: "healthBar",
          style: {
            width: everyFrame(() => `${(health() / maxHealth()) * 100 || 0}%`),
          },
        }, [
          div({
            class: "healthBarTopGradient",
          }),
          div({
            class: "healthBarBottomGradient",
          })
        ]),
      ],
    ),
  ]);
}