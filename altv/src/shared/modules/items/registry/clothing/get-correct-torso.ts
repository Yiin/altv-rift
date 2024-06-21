import alt from "@altv/shared";
import TORSO_MALE from "./torso_male.json";
import TORSO_FEMALE from "./torso_female.json";
import { TopItemInfo } from "./top/top.items";

function getTorso(
  obj: any,
  drawableId: number,
  textureId: number,
): {
  drawableId: number;
  textureId: number;
} | null {
  if (obj[drawableId] === undefined || obj[drawableId][textureId] === undefined) {
    console.error(`Invalid top: ${drawableId} ${textureId}`);
    return null;
  } else {
    // player.setClothes(11, drawable, texture, 2);
    if (obj[drawableId][textureId].BestTorsoDrawable != -1) {
      return {
        drawableId: obj[drawableId][textureId].BestTorsoDrawable,
        textureId: obj[drawableId][textureId].BestTorsoTexture,
      };
    }
  }
  return null;
}

export function getTorsoForTop(
  model: number,
  topItemInfo: TopItemInfo,
): {
  drawableId: number;
  textureId: number;
} {
  if (alt.hash("mp_m_freemode_01") === model) {
    const torso = getTorso(TORSO_MALE, topItemInfo.drawableId, topItemInfo.textureId);

    if (torso) {
      return torso;
    }

    else if (topItemInfo.restrictionTags?.includes('OPEN_JACKET')) {
      return {
        drawableId: 14,
        textureId: 0,
      };
    }
    else {
      return {
        drawableId: 15,
        textureId: 0,
      };
    }
  } else {
    return (
      getTorso(TORSO_FEMALE, topItemInfo.drawableId, topItemInfo.textureId) || {
        drawableId: 4,
        textureId: 0,
      }
    );
  }
}
