import alt from "@altv/client";
import ControlsController from "./controls";
import { isTyping } from "@/core/user-interface/event-helpers";

export default class MouseController {
  public static instance = new MouseController();

  private constructor() {
    alt.Events.onKeyDown(this.onKeyDown);
  }

  private _state: boolean = false;

  get state() {
    return this._state;
  }

  private onKeyDown = ({ key }: alt.Events.KeyUpDownEventParameters) => {
    if (isTyping()) {
      return;
    }

    if (key !== 113) return;
    this.toggleMouse();
  };

  public toggleMouse(newState?: boolean): void {
    if (this._state === newState && newState != null) return;
    alt.Cursor.visible = this._state = newState ?? !this._state;

    if (this._state) {
      ControlsController.instance.block("mouse");
    } else {
      ControlsController.instance.unblock("mouse");
    }
  }
}
