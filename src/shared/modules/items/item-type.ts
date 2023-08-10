import { MakeEnum, makeEnum } from "../../utility/make-enum";

export const ItemType = makeEnum({
  WEAPON: "WEAPON",
  AMMO: "AMMO",
  CLOTHING: "CLOTHING",
  CONSUMABLE: "CONSUMABLE",
  MATERIAL: "MATERIAL",
});

export type ItemType = MakeEnum<typeof ItemType>;
