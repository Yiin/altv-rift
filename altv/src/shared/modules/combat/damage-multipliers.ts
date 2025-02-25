import alt from "@altv/shared";

const DamageMultiplier = {
  [alt.Enums.BodyPart.PELVIS]: 0.9,
  [alt.Enums.BodyPart.LEFT_FOOT]: 0.5,
  [alt.Enums.BodyPart.RIGHT_FOOT]: 0.5,
  [alt.Enums.BodyPart.LEFT_UPPER_ARM]: 0.6,
  [alt.Enums.BodyPart.RIGHT_UPPER_ARM]: 0.6,
  [alt.Enums.BodyPart.LEFT_WRIST]: 0.3,
  [alt.Enums.BodyPart.RIGHT_WRIST]: 0.3,
  [alt.Enums.BodyPart.NECK]: 1.0,
  [alt.Enums.BodyPart.HEAD]: 3.5,
  [alt.Enums.BodyPart.LEFT_LEG]: 0.8,
  [alt.Enums.BodyPart.RIGHT_LEG]: 0.8,
  [alt.Enums.BodyPart.LOWER_TORSO]: 1.0,
  [alt.Enums.BodyPart.UPPER_TORSO]: 1.0,
  [alt.Enums.BodyPart.CHEST]: 0.9,
  [alt.Enums.BodyPart.UNDER_NECK]: 1.2,

  [alt.Enums.BodyPart.UNKNOWN]: 1,
};

export function getBodyPartDamageMultiplier(bodyPart: alt.Enums.BodyPart): number {
  return DamageMultiplier[bodyPart] ?? 1;
}
