import native from "natives";

export function drawBar(
  value: number,
  lineHeight: number,
  scale: number,
  position: number,
  r: number,
  g: number,
  b: number,
  a: number
) {
  const healthWidth = value * 0.0005 * scale;
  native.drawRect(
    (healthWidth - 100 * 0.0005 * scale) / 2,
    lineHeight + position * lineHeight,
    healthWidth,
    lineHeight / 4,
    r,
    g,
    b,
    a,
    false
  );
}

export function drawBarBackground(
  value: number,
  lineHeight: number,
  scale: number,
  position: number,
  r: number,
  g: number,
  b: number,
  a: number
) {
  const width = value * 0.0005 * scale;
  native.drawRect(
    0,
    lineHeight + position * lineHeight,
    width + 0.002,
    lineHeight / 3 + 0.002,
    0,
    0,
    0,
    255,
    false
  );
  native.drawRect(
    0,
    lineHeight + position * lineHeight,
    width,
    lineHeight / 3,
    r,
    g,
    b,
    a,
    false
  );
}
