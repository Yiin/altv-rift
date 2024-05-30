import alt from "@altv/client";
import game from "@altv/natives";
import { ControlType, Control } from "../constants/controls";

export function disableControlActionsUntilKeyup(
  controlActions: [ControlType, Control][],
  keyCode: alt.Enums.KeyCode,
) {
  const tick = alt.Timers.everyTick(() => {
    controlActions.forEach(([controlType, control]) => {
      game.disableControlAction(controlType, control, false);
    });
  });

  const keyUp = alt.Events.onKeyUp(({ key }) => {
    if (key === keyCode) {
      tick.destroy();
      keyUp.destroy();

      alt.Timers.nextTick(() => {
        controlActions.forEach(([controlType, control]) => {
          game.enableControlAction(controlType, control, false);
        });
      });
    }
  });
}
