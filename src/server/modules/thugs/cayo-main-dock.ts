import alt from "@altv/server";
import { minutesToMilliseconds } from "date-fns";
import {
  FirearmWeapon,
  MeleeWeapon,
  ThrowableWeapon,
  createItem,
  getWeaponHash,
} from "@shared/modules/items";
import { createInventory } from "@shared/modules/inventory";
import { createTerroristPed } from "../peds/registry";
import { createStorage } from "../items-manager";
import { buildAirDropLootTable } from "../air-drops";
import { buildLootTable } from "../loot/loot-tables";
import { CAYO_MAIN_DOCK_LOOT } from "../loot/loot-tables/cayo-main-dock-loot.low";

const positions = [
  { x: 4842.56591796875, y: -5174.89892578125, z: 2.2929341793060303 },
  { x: 4855.07470703125, y: -5165.57275390625, z: 2.438697576522827 },
  {
    x: 4860.36376953125,
    y: -5176.3515625,
    z: 2.4386980533599854,
  },
  {
    x: 4866.88916015625,
    y: -5162.43408203125,
    z: 2.438292980194092,
  },
  { x: 4882.1953125, y: -5187.34716796875, z: 2.438293933868408 },
  { x: 4900.8115234375, y: -5190.18310546875, z: 2.4382951259613037 },
  { x: 4899.9169921875, y: -5212.583984375, z: 2.5120465755462646 },
  { x: 4923.578125, y: -5243.92333984375, z: 2.5234999656677246 },
  { x: 4922.0546875, y: -5236.62890625, z: 2.5227901935577393 },
  { x: 4942.02294921875, y: -5206.12158203125, z: 2.4374868869781494 },
];

// "CS_JohnnyKlebitz",
// "CS_Josef",
// "CSB_HelmsmanPavel",
// "CSB_Ramp_hic",
// "CSB_Vagos_Leader",
// "G_M_M_Goons_01",
// "G_M_Y_Lost_01",

const models = [
  "G_M_Y_MexGoon_03",
  "G_M_Y_MexGoon_03",
  "G_M_Y_MexGoon_03",
  "G_M_Y_MexGoon_03",
  "G_M_Y_MexGoon_03",
  "G_M_Y_MexGoon_03",
  "G_M_Y_MexGoon_03",
  "G_M_Y_MexGoon_03",
  "G_M_Y_MexGoon_03",
  "G_M_Y_MexGoon_03",
];

const weapons = [
  // MeleeWeapon.BAT,
  FirearmWeapon.COMBATMG,
  FirearmWeapon.COMBATPISTOL,
  FirearmWeapon.MICROSMG,
  FirearmWeapon.SMG,
];

const thugs = new Set<alt.Ped>();

let loot: alt.VirtualEntity | null = null;

function setupThugs() {
  // Cleanup previous loot
  loot?.destroy();

  for (const thug of thugs) {
    thug.destroy();
  }
  thugs.clear();

  const availableModels = [...models];

  for (const pos of positions) {
    const modelIndex = ~~(Math.random() * availableModels.length);
    const model = availableModels[modelIndex];
    availableModels.splice(modelIndex, 1);

    const weaponIndex = ~~(Math.random() * weapons.length);
    const weapon = getWeaponHash(weapons[weaponIndex]);

    const thug = createTerroristPed({ model, pos, heading: 0 }, { weapon, health: 300 });
    thugs.add(thug);
  }
}

setupThugs();

alt.Events.onPedDeath(({ ped }) => {
  handleThugDeath(ped);
});

alt.Events.onPedDamage(({ ped }) => {
  if (ped.health === 0) {
    handleThugDeath(ped);
  }
});

function handleThugDeath(ped: alt.Ped) {
  if (!thugs.has(ped)) {
    return;
  }

  thugs.delete(ped);

  alt.Timers.setTimeout(() => {
    ped.destroy();
  }, 3000);

  if (thugs.size === 0) {
    alt.log("All thugs dead, respawning in 1 minute");
    alt.Timers.setTimeout(setupThugs, minutesToMilliseconds(1));

    loot = createStorage({
      pos: { x: 4837.678, y: -5178.569, z: 1.223 },
      inventory: createInventory({
        size: 8,
        items: buildLootTable(CAYO_MAIN_DOCK_LOOT),
      }),
      label: "Main Dock Loot",
    });
  } else {
    alt.log(`Thugs remaining: ${thugs.size}`);
  }
}
