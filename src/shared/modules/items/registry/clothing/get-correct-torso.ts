import alt from "@altv/shared";
import TORSO_MALE from "./torso_male.json";
import TORSO_FEMALE from "./torso_female.json";

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
  topDrawableId: number,
  topTextureId: number,
): {
  drawableId: number;
  textureId: number;
} {
  if (alt.hash("mp_m_freemode_01") === model) {
    return (
      getTorso(TORSO_MALE, topDrawableId, topTextureId) || {
        drawableId: 15,
        textureId: 0,
      }
    );
  } else {
    return (
      getTorso(TORSO_FEMALE, topDrawableId, topTextureId) || {
        drawableId: 3,
        textureId: 0,
      }
    );
  }
}
