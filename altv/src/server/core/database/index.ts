import { PrismaClient } from "@prisma/client";
import _ from "lodash";
import { container } from "@shared/dependency-injection";
import { getDefaultCharacterData } from "@/modules/character";

export const prisma = new PrismaClient();

let connected = false;

prisma.$connect().then(async () => {
  connected = true;

  fillMissingCharacterFieldsWithDefaultData();

  // await prisma.character.deleteMany().then(() => {
  //   console.log("Removed all characters");
  // });
});

function getMissingKeysRecursive(
  defaultData: Record<string, any>,
  characterData: Record<string, any>,
  depth = 0,
): Record<string, any> {
  let missingData: Record<string, any> = {};

  for (const key in defaultData) {
    if (!characterData.hasOwnProperty(key)) {
      const value = defaultData[key];
      const isObject = value && typeof value === "object" && !Array.isArray(value);

      missingData[key] = isObject
        ? {
          set: value,
        } : value;
    } else if (
      typeof defaultData[key] === "object" &&
      defaultData[key] !== null &&
      !Array.isArray(defaultData[key])
    ) {
      const nestedMissingData = getMissingKeysRecursive(defaultData[key], characterData[key], depth + 1);
      if (Object.keys(nestedMissingData).length > 0) {
        missingData[key] = nestedMissingData;
      }
    }
  }

  return missingData;
}

/**
 * When we add new structures to characters we need to migrate current entries in the database
 * to include them, otherwise when loading characters we might get error about trying to deserialize null
 * to new structure.
 */
async function fillMissingCharacterFieldsWithDefaultData() {
  const characters = (await prisma.character.findRaw()) as any as Record<string, any>[];

  for (const character of characters) {
    let missingData = getMissingKeysRecursive(getDefaultCharacterData(), character);

    if (Object.keys(missingData).length === 0) continue;

    missingData = Object.fromEntries(Object.entries(missingData).map(([key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        if (character.hasOwnProperty(key)) {
          return [key, { update: value }];
        } else {
          return [key, { set: value }];
        }
      }
      return [key, value];
    }));

    await prisma.character.update({
      where: {
        id: character._id["$oid"],
      },
      data: missingData,
    });
  }
}

container.bind(PrismaClient).toConstantValue(prisma);
