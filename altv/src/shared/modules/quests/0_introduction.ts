export const Key = "0_introduction";

export const Introduction = {
  Key,
  Facts: {
    GOT_INTRODUCTION: `${Key}_got_introduction`,
    OPEN_INVENTORY: `${Key}_open_inventory`,
    GOT_RATBIKE: `${Key}_got_ratbike`,
    TURN_ON_ENGINE: `${Key}_turn_on_engine`,
    TALKED_WITH_DIEGO: `${Key}_talked_with_diego`,
    STARTED_FISHING: `${Key}_started_fishing`,
    COMPLETED_FISHING: `${Key}_completed_fishing`,
    STARTED_MINING: `${Key}_started_mining`,
    COMPLETED_MINING_STARTED_SMITHING: `${Key}_completed_mining_started_smithing`,
    COMPLETED_MINING_AND_SMITHING: `${Key}_completed_mining_and_smithing`,
    STARTED_WOODCUTTING: `${Key}_started_woodcutting`,
    COMPLETED_WOODCUTTING: `${Key}_completed_woodcutting`,
    STARTED_CRAFTING: `${Key}_started_crafting`,
    COMPLETED_CRAFTING: `${Key}_completed_crafting`,
    COMPLETED_ALL: `${Key}_completed_all`,
    GOT_WEAPON: `${Key}_got_weapon`,
    KILLED_BOARS_N: `${Key}_killed_boars:{0}`,
  },
  Constants: {
    PALM_LOGS_NEEDED: 50,
    RAW_TROUT_NEEDED: 50,
    IRON_ORE_NEEDED: 30,
    HANDGUN_AMMO_NEEDED: 200,
  },
} as const;
