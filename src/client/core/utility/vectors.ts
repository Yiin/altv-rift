import alt from "@altv/client";

export function vec3ToArr(vec: alt.IVector3) {
  return [vec.x, vec.y, vec.z] as const;
}

export function arrToVec3(arr: [number, number, number]) {
  return new alt.Vector3(arr[0], arr[1], arr[2]);
}

export function vec2ToArr(vec: alt.IVector2) {
  return [vec.x, vec.y] as const;
}

export function arrToVec2(arr: [number, number]) {
  return new alt.Vector2(arr[0], arr[1]);
}
