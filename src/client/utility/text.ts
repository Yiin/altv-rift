import alt from "alt-client";
import game from "natives";
import { Timer } from "./timers";

const temporaryText: any[] = [];
let tempInterval: number | undefined;

/**
 * Draw text on your screen in a 2D position with an every tick.
 */
export function drawText2D(
  text: string,
  pos: alt.IVector2,
  scale: number,
  color: alt.RGBA,
  alignment: number = 0,
  padding: number = 0
) {
  if (scale > 2) {
    scale = 2;
  }

  game.clearDrawOrigin();
  game.beginTextCommandDisplayText("STRING");
  game.addTextComponentSubstringPlayerName(text);
  game.setTextFont(4);
  game.setTextScale(1, scale);
  game.setTextColour(color.r, color.g, color.b, color.a);
  game.setTextOutline();
  game.setTextDropShadow();
  if (alignment !== null) {
    game.setTextWrap(padding, 1 - padding);
    game.setTextJustification(alignment);
  }

  game.endTextCommandDisplayText(pos.x, pos.y, 0);
}

export function drawRectangle(
  pos: alt.IVector3,
  size: alt.IVector2,
  color: alt.RGBA
) {
  const [isOnScreen, x, y] = game.getScreenCoordFromWorldCoord(
    pos.x,
    pos.y,
    pos.z,
    0,
    0
  );
  if (!isOnScreen) {
    return;
  }

  game.setDrawOrigin(pos.x, pos.y, pos.z, false);
  game.drawRect(
    0,
    0,
    size.x,
    size.y,
    color.r,
    color.g,
    color.b,
    color.a,
    false
  );
  game.clearDrawOrigin();
}

export function drawRectangle2D(
  pos: alt.IVector2,
  size: alt.IVector2,
  color: alt.RGBA
) {
  game.clearDrawOrigin();
  game.drawRect(
    pos.x,
    pos.y,
    size.x,
    size.y,
    color.r,
    color.g,
    color.b,
    color.a,
    false
  );
}

/**
 * Draw stable text in a 3D position with an every tick.
 */
export function drawText3D(
  text: string,
  pos: alt.IVector3,
  scale: number,
  color: alt.RGBA
) {
  if (scale > 2) {
    scale = 2;
  }

  game.setDrawOrigin(pos.x, pos.y, pos.z, false); // Used to stabalize text, sprites, etc. in a 3D Space.
  game.beginTextCommandDisplayText("STRING");
  game.addTextComponentSubstringPlayerName(text);
  game.setTextFont(4);
  game.setTextScale(1, scale);
  game.setTextWrap(0.0, 1.0);
  game.setTextColour(color.r, color.g, color.b, color.a);
  game.setTextOutline();
  game.setTextDropShadow();
  game.setTextJustification(0);
  game.endTextCommandDisplayText(0, 0, 0);
  game.clearDrawOrigin();
}

/**
 * Adds text temporarily on the screen.
 */
export function addTemporaryText(
  identifier: any,
  msg: string,
  x: number,
  y: number,
  scale: number,
  r: number,
  g: number,
  b: number,
  a: number,
  ms: number
) {
  const index = temporaryText.findIndex(
    (data) => data.identifier === identifier
  );

  if (index !== -1) {
    try {
      alt.clearTimeout(temporaryText[index].timeout);
      temporaryText[index].timeout = null;
    } catch (err) {}

    temporaryText.splice(index, 1);
  }

  const timeout = alt.setTimeout(() => {
    removeText(identifier);
  }, ms);

  temporaryText.push({ identifier, msg, x, y, scale, r, g, b, a, timeout });

  if (tempInterval) {
    Timer.clearInterval(tempInterval);
    tempInterval = undefined;
  }

  tempInterval = Timer.createInterval(handleDrawTemporaryText, 0, "text.ts");
}

/**
 * Stop drawing temporary text based on the name.
 */
function removeText(identifier: string): void {
  const index = temporaryText.findIndex(
    (data) => data.identifier === identifier
  );
  if (index <= -1) {
    return;
  }

  temporaryText.splice(index, 1);

  if (temporaryText.length <= 0) {
    Timer.clearInterval(tempInterval!);
    tempInterval = undefined;
  }
}

/**
 * Used in a setInterval,0 to draw text in the temporaryText array.
 */
function handleDrawTemporaryText(): void {
  for (let i = 0; i < temporaryText.length; i++) {
    const data = temporaryText[i];
    drawText2D(
      data.msg,
      { x: data.x, y: data.y },
      data.scale,
      new alt.RGBA(data.r, data.g, data.b, data.a)
    );
  }
}
