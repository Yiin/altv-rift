import alt from "@altv/client";

export function getCrossProduct(v1: alt.Vector3, v2: alt.Vector3): alt.Vector3 {
  return new alt.Vector3(
    v1.y * v2.z - v1.z * v2.y,
    v1.z * v2.x - v1.x * v2.z,
    v1.x * v2.y - v1.y * v2.x,
  );
}

export function getNormalizedVector(vector: alt.Vector3): alt.Vector3 {
  const mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
  return new alt.Vector3(vector.x / mag, vector.y / mag, vector.z / mag);
}

export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Could also be seen as rotAnglesToVector
 */
export function rotationToDirection(rotation: alt.IVector3): alt.Vector3 {
  const z = degToRad(rotation.z);
  const x = degToRad(rotation.x);
  const num = Math.abs(Math.cos(x));

  return new alt.Vector3(-Math.sin(z) * num, Math.cos(z) * num, Math.sin(x));
}

export function getDirectionFromRotation(rotation: alt.IVector3): alt.IVector3 {
  const z = rotation.z * (Math.PI / 180.0);
  const x = rotation.x * (Math.PI / 180.0);
  const num = Math.abs(Math.cos(x));

  return new alt.Vector3(-Math.sin(z) * num, Math.cos(z) * num, Math.sin(x));
}

export function getPointsInCircle(
  points: number,
  radius: number,
  center: alt.IVector2,
): alt.IVector2[] {
  const slice = (2 * Math.PI) / points;
  const pointDefs: { x: number; y: number }[] = [];

  for (let i = 0; i < points; i++) {
    const sliceAngle = slice * i;
    const x = center.x + (radius / 2) * Math.cos(sliceAngle);
    const y = center.y + radius * Math.sin(sliceAngle);
    pointDefs.push({ x, y });
  }

  return pointDefs;
}

export function getAverage(data: number[]): number {
  const sum = data.reduce((a, b) => a + b);

  return sum / data.length;
}

export function getHeadingInDegrees(pointA: alt.IVector2, pointB: alt.IVector2) {
  const { x, y } = pointA;

  const dx = pointB.x - x;
  const dy = pointB.y - y;

  const angle = Math.atan2(dy, dx);

  const degrees = ((angle * 180) / Math.PI + 360) % 360;
  return degrees - 90;
}

/**
 * fromPoint ----------X<-offset-> toPoint
 * Finds position of X
 */
export function getPointNextToPointRelativeToPoint(
  fromPoint: alt.IVector2,
  toPoint: alt.IVector2,
  offset: number,
) {
  // Calculate the difference in x and y between the player and the tree
  const dx = toPoint.x - fromPoint.x;
  const dy = toPoint.y - fromPoint.y;

  // Calculate the length of this difference vector
  const length = Math.sqrt(dx * dx + dy * dy);

  // Normalize the difference vector (make its length 1)
  const nx = dx / length;
  const ny = dy / length;

  // Calculate the target position
  const targetX = toPoint.x - nx * offset;
  const targetY = toPoint.y - ny * offset;

  return new alt.Vector2(targetX, targetY);
}
