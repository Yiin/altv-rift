import alt from "@altv/client";
import game from "@altv/natives";

export function getScaledCursorPosition(): alt.IVector2 {
  const cursor = alt.Cursor.pos;
  const [_nothing, _x, _y] = game.getActualScreenResolution(0, 0);
  return {
    x: cursor.x / _x,
    y: cursor.y / _y,
  };
}
