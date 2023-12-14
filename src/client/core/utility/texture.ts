import * as alt from "@altv/client";
import * as game from "@altv/natives";

const textureData: Record<any, any> = {};

export function drawTexture2D(
  dictionary: string,
  name: string,
  position: alt.IVector2,
  scale: number = 1,
  opacity: number = 255
) {
  if (!game.hasStreamedTextureDictLoaded(dictionary)) {
    game.requestStreamedTextureDict(dictionary, false);
    alt.log(`Requested Texture Dictionary: ${dictionary}`);
    return;
  }

  const identifier = `${dictionary}${name}`;
  if (!textureData[identifier]) {
    const [width, height] = game.getActualScreenResolution(0, 0);
    const resolution = game.getTextureResolution(dictionary, name);
    textureData[identifier] = {
      x: resolution.x / width,
      y: resolution.y / height,
    };
  }

  const texture = textureData[identifier];
  if (!texture) {
    return;
  }

  const width = texture.x * scale;
  const height = texture.y * scale;
  game.drawSprite(
    dictionary,
    name,
    position.x,
    position.y,
    width,
    height,
    0,
    255,
    255,
    255,
    opacity,
    false,
    undefined
  );
}

export function drawTexture(
  dictionary: string,
  name: string,
  position: alt.Vector3,
  scale: number = 1
) {
  if (!game.hasStreamedTextureDictLoaded(dictionary)) {
    game.requestStreamedTextureDict(dictionary, false);
    alt.log(`Requested Texture Dictionary: ${dictionary}`);
    return;
  }

  const identifier = `${dictionary}${name}`;
  if (!textureData[identifier]) {
    const [width, height] = game.getActualScreenResolution(0, 0);
    const resolution = game.getTextureResolution(dictionary, name);
    textureData[identifier] = {
      x: resolution.x / width,
      y: resolution.y / height,
    };
  }

  const texture = textureData[identifier];
  if (!texture) {
    return;
  }

  const width = texture.x * scale;
  const height = texture.y * scale;
  const [visible, x, y] = game.getScreenCoordFromWorldCoord(position.x, position.y, position.z);

  if (!visible) {
    return;
  }

  game.setDrawOrigin(position.x, position.y, position.z, false);
  game.drawSprite(dictionary, name, 0, 0, width, height, 0, 255, 255, 255, 255, false, undefined);
  game.clearDrawOrigin();
}
