import alt from "alt-client";
import game from "natives";
import { KeyCode } from "altv-enums";
import { reactive, ref, watchEffect } from "vue";
import { TargetAction } from "@shared/store/client.store";
import { UIElement } from "@shared/enums/ui";
import { clientState } from "@/core/store/client.store";
import Raycast from "@/core/utility/raycast";
import { VehicleBones } from "@/core/constants/vehicle-bones";
import { everyTickWhile } from "@/core/utility/event-helpers";
import { getScreenResolution } from "@/core/utility/screen-resolution";
import { toggleElement } from "../../webview";

type Action = {
  action: TargetAction;
  onAction(): void;
};

export type ActionRegistration = () => Action | null;

const targetActions: ActionRegistration[] = reactive([]);
let currentAction: Action | null = null;

export function registerTargetAction(action: ActionRegistration) {
  targetActions.push(action);
}

watchEffect(() => {
  for (const action of targetActions) {
    const result = action();

    if (result) {
      currentAction = result;
      clientState.targetAction = result.action;
      toggleElement(UIElement.TARGET_ACTION, true);
      return;
    }
  }
  clientState.targetAction = currentAction = null;
  toggleElement(UIElement.TARGET_ACTION, false);
});

alt.on("keydown", (key) => {
  if (key === KeyCode.E) {
    if (!currentAction) {
      return;
    }

    currentAction.onAction();
  }
});

const vehicleAction = ref<Action | null>(null);

function getTargetedVehicleResult() {
  const result = Raycast.simpleRaycast();
  if (result.entityHit && game.isEntityAVehicle(result.entityHit)) {
    return result as {
      didComplete: true;
      didHit: true;
      position: alt.IVector3;
      entityHit: number;
    };
  }
  return null;
}

function searchForAction() {
  const interval = alt.setInterval(() => {
    const result = getTargetedVehicleResult();

    if (result) {
      alt.clearInterval(interval);

      everyTickWhile(
        () => vehicleAction.value !== null,
        () => {
          const result = getTargetedVehicleResult();

          if (!result) {
            vehicleAction.value = null;
            return;
          }

          const boneIndex = game.getEntityBoneIndexByName(result.entityHit, VehicleBones.BOOT);

          if (boneIndex !== -1) {
            const trunkPosition = game.getWorldPositionOfEntityBone(result.entityHit, boneIndex);

            const [inScreen, x, y] = game.getScreenCoordFromWorldCoord(
              trunkPosition.x,
              trunkPosition.y,
              trunkPosition.z
            );

            if (inScreen) {
              vehicleAction.value = {
                action: {
                  icon: "trunk",
                  text: "Open trunk",
                  screenPos: { x: x * getScreenResolution().x, y: y * getScreenResolution().y },
                },
                onAction() {},
              };
              return;
            }
          }
          vehicleAction.value = null;
        },
        searchForAction,
        {
          skipFirstCheck: true,
        }
      );
    }
  }, 300);
}

// searchForAction();

registerTargetAction(() => {
  return vehicleAction.value;
});
