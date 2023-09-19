import alt from "alt-shared";
import TORSO_MALE from "./torso_male.json";
import TORSO_FEMALE from "./torso_female.json";

function getTorso(obj: any, drawableId: number, textureId: number) {
  if (obj[drawableId] === undefined || obj[drawableId][textureId] === undefined) {
    throw new Error(`Invalid top: ${drawableId} ${textureId}`);
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

export function getTorsoForTop(model: number, topDrawableId: number, topTextureId: number) {
  if (alt.hash("mp_m_freemode_01") === model) {
    return getTorso(TORSO_MALE, topDrawableId, topTextureId);
  } else {
    return getTorso(TORSO_FEMALE, topDrawableId, topTextureId);
  }
}
