import { type Store, type StoreDefinition } from "pinia";
import { type Character, EquipmentSlot } from "@shared/interfaces";
import { Ammo } from "@shared/modules/items";

type CharacterStore = StoreDefinition<"character", Character, {}, {}>;

let characterStore: CharacterStore;

export function setCharacterStore(store: CharacterStore) {
  characterStore = store;
}

export function isCharacterStoreAvailable() {
  return !!characterStore;
}

export const useCharacter = () =>
  "altMock" in globalThis
    ? ({
        id: "0x",
        appearance: {
          sex: 1,
        },
        equipment: {
          [EquipmentSlot.HandgunAmmo]: {
            key: Ammo.HANDGUN_AMMO,
            amount: 1000,
          },
        },
        inventory: {
          size: 30,
          items: [],
        },
        blueprints: [
          "assaultrifle",
          "handgunammo",
          "hatchet",
          "advancedrifle",
          "appistol",
          "assaultriflemk2",
          "assaultshotgun",
          "assaultsmg",
          "autoshotgun",
          "bullpuprifle",
          "bullpupriflemk2",
          "bullpupshotgun",
          "carbinerifle",
          "carbineriflemk2",
          "ceramicpistol",
          "combatmg",
          "combatmgmk2",
          "combatpdw",
          "combatpistol",
          "combatshotgun",
          "compactlauncher",
          "compactrifle",
          "dbshotgun",
          "doubleaction",
          "emplauncher",
          "gadgetpistol",
          "grenadelauncher",
          "gusenberg",
          "heavypistol",
          "heavyrifle",
          "heavyshotgun",
          "heavysniper",
        ],
      } as any as Store<"character", Character, {}, {}>)
    : characterStore?.();
