function makeEnum<T extends { [index: string]: U }, U extends string>(x: T) {
  return x;
}

export const ItemType = makeEnum({
  WEAPON: "WEAPON",
  AMMO: "AMMO",
  CLOTHING: "CLOTHING",
});

export type ItemType = (typeof ItemType)[keyof typeof ItemType];
