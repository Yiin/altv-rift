import alt from "@altv/server";
import { PrismaClient } from "@prisma/client";
import _ from "lodash";
import { container } from "@shared/dependency-injection";
import { getDefaultCharacterData } from "@/modules/character/get-default-character-data";

export const prisma = new PrismaClient();

let connected = false;

prisma.$connect().then(async () => {
  connected = true;

  fillMissingCharacterFieldsWithDefaultData();
});

async function fillMissingCharacterFieldsWithDefaultData() {
  const characters = (await prisma.character.findRaw()) as any as Record<string, any>[];

  for (const character of characters) {
    // pick keys that are in default character data but not in the character:
    const missingKeys = _.difference(
      Object.keys(getDefaultCharacterData()),
      Object.keys(character),
    );

    // construct an object with the missing keys and their default values:
    const missingData = _.pick(getDefaultCharacterData(), missingKeys);

    await prisma.character.update({
      where: {
        id: character._id["$oid"],
      },
      data: Object.fromEntries(
        Object.entries(missingData).map(([key, value]) =>
          value && typeof value === "object" && !Array.isArray(value)
            ? [key, { set: value }]
            : [key, value],
        ),
      ),
    });
  }
}

// prisma.$on("beforeExit", async () => {
//   if (!connected) {
//     console.error("Couldn't connect to the database. `$ npm run mongo`?");
//     alt.stopServer();
//   }
// });

container.bind(PrismaClient).toConstantValue(prisma);
