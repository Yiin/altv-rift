import { TopItemInfo } from "./top/top.items";
import { getItemInfoByKey } from "../../items-registry";

export function getTorsoForTop(
  topItemInfo: TopItemInfo,
) {
  const torsoKey = topItemInfo.torsos?.[0];

  if (torsoKey) {
    const torso = getItemInfoByKey(torsoKey);

    return torso;
  }

  return null;
}
