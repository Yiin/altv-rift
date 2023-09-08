import alt from "alt-client";
import game from "natives";

export function getScaledCursorPosition(): alt.IVector2 {
  const cursor = alt.getCursorPos();
  const [_nothing, _x, _y] = game.getActualScreenResolution(0, 0);
  return {
    x: cursor.x / _x,
    y: cursor.y / _y,
  };
}
