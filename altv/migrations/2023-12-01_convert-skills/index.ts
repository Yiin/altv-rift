import { PrismaClient } from "@prisma/client";
import { Migration } from "..";

export const migration: Migration = {
  name: "2023-12-01_convert-skills-to-profession-skill",
  execute: async (prisma: PrismaClient) => {
    // Use character.findRaw() instead of $runCommandRaw for fetching data
    const result = (await prisma.character.findRaw({
      filter: {}, // No filter - get all characters
    })) as any;

    // Access the result, which is an array of characters
    const characters = result || [];

    for (const character of characters) {
      const skills = character.skills || {}; // Add null check

      // Create default ProfessionSkill structure
      const defaultSkill = { exp: 0, learnedSkills: [] };

      // Handle each skill field explicitly, ensuring proper default values
      // Convert existing Int fields to ProfessionSkill
      const updatedSkills = {
        woodcutting:
          typeof skills.woodcutting === "number"
            ? { exp: skills.woodcutting, learnedSkills: [] }
            : skills.woodcutting && typeof skills.woodcutting === "object"
              ? skills.woodcutting
              : defaultSkill,
        fishing:
          typeof skills.fishing === "number"
            ? { exp: skills.fishing, learnedSkills: [] }
            : skills.fishing && typeof skills.fishing === "object"
              ? skills.fishing
              : defaultSkill,
        mining:
          typeof skills.mining === "number"
            ? { exp: skills.mining, learnedSkills: [] }
            : skills.mining && typeof skills.mining === "object"
              ? skills.mining
              : defaultSkill,
        crafting:
          typeof skills.crafting === "number"
            ? { exp: skills.crafting, learnedSkills: [] }
            : skills.crafting && typeof skills.crafting === "object"
              ? skills.crafting
              : defaultSkill,
        medic: skills.medic && typeof skills.medic === "object" ? skills.medic : defaultSkill,
        engineer:
          skills.engineer && typeof skills.engineer === "object" ? skills.engineer : defaultSkill,
        // Add new professions with default values
        farmer: defaultSkill,
        foodDelivery: defaultSkill,
        cargoCarrier: defaultSkill,
        firefighter: defaultSkill,
        builder: defaultSkill,
        electrician: defaultSkill,
        plumber: defaultSkill,
        mechanic: defaultSkill,
        gardener: defaultSkill,
        mortician: defaultSkill,
      };

      // Still use $runCommandRaw for the update operation as it's not a find/aggregate command
      await prisma.$runCommandRaw({
        update: "Character",
        updates: [
          {
            q: { _id: character._id },
            u: { $set: { skills: updatedSkills } },
          },
        ],
      });
    }
  },
};
