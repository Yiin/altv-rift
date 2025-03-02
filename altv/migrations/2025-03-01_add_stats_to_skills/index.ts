import { PrismaClient } from "@prisma/client";
import { Migration } from "../index";

export const migration: Migration = {
  name: "2025-03-01_add_stats_to_skills",
  execute: async (prisma: PrismaClient) => {
    // Find all characters
    const result = (await prisma.character.findRaw({
      filter: {}, // No filter - get all characters
    })) as any;

    // Access the result, which is an array of characters
    const characters = result || [];
    console.log(`Found ${characters.length} characters to update with stats field`);

    // Process each character
    for (const character of characters) {
      if (!character.skills) {
        console.log(`Character ${character.name || character._id} has no skills, skipping`);
        continue;
      }

      const skills = character.skills;
      let hasUpdates = false;

      // Initialize the default stats for each profession skill
      const professionSkills = [
        "woodcutting",
        "fishing",
        "mining",
        "crafting",
        "medic",
        "engineer",
        "farmer",
        "foodDelivery",
        "cargoCarrier",
        "firefighter",
        "builder",
        "electrician",
        "plumber",
        "mechanic",
        "gardener",
        "mortician",
      ];

      // Check each profession skill and add stats if missing
      for (const skill of professionSkills) {
        if (skills[skill] && typeof skills[skill] === "object" && !skills[skill].stats) {
          hasUpdates = true;

          // Create appropriate default stats based on the profession
          if (skill === "foodDelivery") {
            // Food delivery specific stats
            skills[skill].stats = {
              totalDeliveries: 0,
              successfulDeliveries: 0,
              failedDeliveries: 0,
              tipsReceived: 0,
              totalEarnings: 0,
              fastestDelivery: 0,
              averageDeliveryTime: 0,
              privateHomeDeliveries: 0,
              regularDeliveries: 0,
              lastDeliveryDate: 0,
            };
          } else {
            // Generic stats for other professions (can be customized later)
            skills[skill].stats = {};
          }
        }
      }

      // Only update if changes were made
      if (hasUpdates) {
        await prisma.$runCommandRaw({
          update: "Character",
          updates: [
            {
              q: { _id: character._id },
              u: { $set: { skills: skills } },
            },
          ],
        });
      }
    }
  },
};
