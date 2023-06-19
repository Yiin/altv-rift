/**

  Title: "Welcome to the City"

  Objective: Introduce new players to the basic game mechanics, including interacting with NPCs, using the inventory, purchasing and equipping items, gaining experience, and completing simple jobs.

  Outline:

  1. Arrival at the City

  • Player spawns in a small, beginner-friendly area of the city.
  • A friendly NPC, John the Guide, approaches the player and initiates a conversation.
    John: Welcome to the city, friend! I'm John, and I'm here to help you get started on your journey. You've just arrived at a bustling metropolis full of opportunities and adventures. How can I help you today?

    Player Options:

    Can you tell me more about the people in this city?
    How do I get started in this world?
    What should I be careful of?

    Option 1:
    Player: Can you tell me more about the people in this city?

    John: Of course! In this city, you'll meet many interesting individuals, each with their own unique personality and story. It's important to interact with them as they can provide you with valuable information, quests, and opportunities. Take your time to get to know them, and you'll find your experience in the city to be much more rewarding.

    Option 2:
    Player: How do I get started in this world?

    John: A great place to begin is by talking to the people around you. They'll often have tasks for you to complete, which will not only help you gain experience and resources, but also introduce you to different aspects of the city. As you progress, you'll learn more about the world and its mechanics, such as jobs, crafting, and territory wars. Just remember, the more you engage with the city and its inhabitants, the more you'll get out of your experience here.

    Option 3:
    Player: What should I be careful of?

    John: While there's a lot of excitement and adventure to be had, it's important to be cautious and mindful of your surroundings. There are dangerous factions, like the Cult groups and Underground Syndicates, which may pose a threat to you and other players. It's wise to be prepared and to work together with others when confronting these challenges. But don't worry too much; there are also plenty of friendly people in the city who are happy to lend a hand.

  • John provides a brief introduction to the game world and its mechanics, emphasizing the importance of interacting with NPCs.
  
  2. Learning to Communicate

  • John directs the player to visit three different NPCs in the nearby vicinity: Maria the Merchant, Pete the Postman, and Lisa the Librarian.
  • Players learn to interact with these NPCs by talking to them, receiving small tasks from each (e.g., delivering a package for Pete).
  • The NPCs introduce themselves, giving a glimpse of their unique personalities and backstories.
  
  3. Using the Inventory

  • After completing the tasks, players return to John the Guide.
  • John rewards the player with a small inventory bag and explains how to access and manage the inventory system.
  • John gives the player a simple item (e.g., an apple) to practice using the inventory system.
  
  4. Purchasing and Equipping Clothes

  • John instructs the player to visit Maria the Merchant to purchase their first set of starting clothes.
  • Maria provides the player with a selection of basic clothes and explains how to buy items.
  • After purchasing the clothes, John demonstrates how to equip them through the inventory system.
  
  5. Gaining Experience and Simple Jobs

  • John explains the concept of experience points and leveling up, emphasizing the importance of completing jobs and tasks to progress in the game.
  • John directs the player to try a simple freelance job (e.g., taxi driving or fishing) to earn some quick cash and gain experience.
  • Upon completion of the job, the player receives experience points and a small amount of in-game currency.
  
  6. Conclusion

  • The player returns to John the Guide, who congratulates them on their progress.
  • John explains that the city offers countless opportunities for adventure, from engaging with the main plot to participating in territory wars and crafting activities.
  • John encourages the player to explore, interact with NPCs, and forge their own path in the GAME world.
  • The tutorial quest ends, and the player is free to explore the city and dive into the game's various activities.

 */

import alt, { Player } from "alt-server";
import { NpcFlags, NpcID, PedType } from "@shared/modules/npc/types";
import { npcStore } from "@/modules/npc";
import dialogue from "./dialogue.yaml";

const QUEST_KEY = "0_tutorial";

export const Q0_TutorialFacts = {
  VISITED_SAM: `${QUEST_KEY}_visited_sam`,
  PICKED_OUTFIT: `${QUEST_KEY}_picked_outfit`,
  CRAFTED_ITEM: `${QUEST_KEY}_crafted_item`,
  FINISHED: `${QUEST_KEY}_finished`,
} as const;

const characters = {
  sam: npcStore.createNpc(
    PedType.STATIC,
    alt.hash("a_m_m_golfer_01"),
    new alt.Vector3({
      x: 1961.425537109375,
      y: 3848.89306640625,
      z: 31.996417999267578,
    }),
    0,
    100,
    {
      name: "Sam",
      flags: NpcFlags.Quest | NpcFlags.Talkable,
    }
  ),
  jane: npcStore.createNpc(
    PedType.STATIC,
    alt.hash("a_f_m_bevhills_01"),
    new alt.Vector3({
      x: 1962.425537109375,
      y: 3848.89306640625,
      z: 31.996417999267578,
    }),
    0,
    100,
    {
      name: "Jane",
      flags: NpcFlags.Quest | NpcFlags.Talkable,
    }
  ),
  tom: npcStore.createNpc(
    PedType.STATIC,
    alt.hash("a_m_m_bevhills_01"),
    new alt.Vector3({
      x: 1963.425537109375,
      y: 3848.89306640625,
      z: 31.996417999267578,
    }),
    0,
    100,
    {
      name: "Tom",
      flags: NpcFlags.Quest | NpcFlags.Talkable,
    }
  ),
};

type DialogRequest = { npcId: NpcID; index: number; option?: number };

type DialogResponse =
  | { from: NpcID; message: string }
  | { message: string | string[] };

createDialog(QUEST_KEY, dialogue, characters);
