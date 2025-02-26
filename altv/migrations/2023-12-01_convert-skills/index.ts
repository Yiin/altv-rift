import { PrismaClient } from "@prisma/client";
import { Migration } from "..";

export const migration: Migration = {
  name: "2023-12-01_convert-skills-to-profession-skill",
  execute: async (prisma: PrismaClient) => {
    const characters = await prisma.character.findMany();

    for (const character of characters) {
      const skills = (character.skills as any) || {}; // Add null check

      // Create default ProfessionSkill structure
      const defaultSkill = { exp: 0, learnedSkills: [] };

      // Handle each skill field explicitly, ensuring proper default values
      // Convert existing Int fields to ProfessionSkill
      const updatedSkills = {
        woodcutting:
          typeof skills.woodcutting === "number"
            ? { exp: skills.woodcutting, learnedSkills: [] }
            : skills.woodcutting || defaultSkill,
        fishing:
          typeof skills.fishing === "number"
            ? { exp: skills.fishing, learnedSkills: [] }
            : skills.fishing || defaultSkill,
        mining:
          typeof skills.mining === "number"
            ? { exp: skills.mining, learnedSkills: [] }
            : skills.mining || defaultSkill,
        crafting:
          typeof skills.crafting === "number"
            ? { exp: skills.crafting, learnedSkills: [] }
            : skills.crafting || defaultSkill,
        medic: typeof skills.medic === "object" ? skills.medic : defaultSkill,
        engineer: typeof skills.engineer === "object" ? skills.engineer : defaultSkill,
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

      await prisma.character.update({
        where: { id: character.id },
        data: { skills: updatedSkills },
      });

      console.log(`Updated skills for character ${character.name}`);
    }
  },
};
