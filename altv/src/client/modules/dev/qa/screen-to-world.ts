import alt from "@altv/client";

export function screenToWorld() {
  const cursorPos = alt.Cursor.pos;
  const camPos = alt.Cam.pos;
  return alt.screenToWorld(cursorPos).sub(camPos).mul(1000).add(camPos);
}
