import { MakeEnum, makeEnum } from "../../utility/make-enum";

export const ItemType = makeEnum({
  WEAPON: "WEAPON",
  AMMO: "AMMO",
  CLOTHING: "CLOTHING",
  CONSUMABLE: "CONSUMABLE",
});

export type ItemType = MakeEnum<typeof ItemType>;
