import alt from "@altv/server";
import { addMinutes, minutesToMilliseconds } from "date-fns";
import { reactive, shallowReactive, watchEffect } from "vue";
import { FirearmWeapon, getWeaponHash } from "@shared/modules/items";
import { createInventory } from "@shared/modules/inventory";
import { StorageType } from "@shared/store/game-state.store";
import { createEnemyPed } from "../peds";
import { createStorage } from "../items-manager";
import { buildLootTable } from "../loot/loot-tables";
import { CAYO_MAIN_DOCK_LOOT } from "../loot/loot-tables/cayo-main-dock-loot.low";
import { createAreaOfInterest } from "../areas-of-interest";
import { createEvent } from "../events";

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

createEvent({
  name: "cayo-main-dock",
  cooldown: minutesToMilliseconds(10),
  setup({ finish }) {
    const enemies = shallowReactive(new Set<alt.Ped>());
    let loot: alt.VirtualEntity | null = null;
    let areaOfInterest: alt.VirtualEntity | null = null;
    let isFinishing = false;

    function setupEnemies() {
      // Cleanup
      loot?.destroy();
      areaOfInterest?.destroy();

      for (const thug of enemies) {
        thug.destroy();
      }
      enemies.clear();

      const availableModels = [...models];

      for (const pos of positions) {
        const modelIndex = ~~(Math.random() * availableModels.length);
        const model = availableModels[modelIndex];
        availableModels.splice(modelIndex, 1);

        const weaponIndex = ~~(Math.random() * weapons.length);
        const weapon = getWeaponHash(weapons[weaponIndex]);

        const thug = createEnemyPed({ model, pos, heading: 0 }, { weapon, health: 300 });
        enemies.add(thug);
      }

      areaOfInterest = createAreaOfInterest({ x: 4837.678, y: -5178.569, z: 1.223 }, 500, {
        areaName: "Main Dock Loot",
        areaType: "contraband",
        areaDescription: `Kill all enemies to claim the loot: ${enemies.size} remaining.`,
      });
    }

    function handleEnemyDeath(ped: alt.Ped) {
      if (!enemies.has(ped)) {
        return;
      }

      enemies.delete(ped);

      alt.Timers.setTimeout(() => {
        if (ped.valid) {
          ped.destroy();
        }
      }, 3000);

      if (areaOfInterest) {
        if (enemies.size > 0) {
          areaOfInterest.streamSyncedMeta.areaDescription = `Kill all enemies to claim the loot: ${enemies.size} remaining.`;
        } else {
          areaOfInterest.streamSyncedMeta.areaDescription = `Claim the loot`;
        }
      }
    }

    setupEnemies();

    const unwatchEffect = watchEffect((onCleanup) => {
      if (enemies.size > 0) {
        return;
      }

      const inventory = reactive(
        createInventory({
          size: 8,
          items: buildLootTable(CAYO_MAIN_DOCK_LOOT),
        }),
      );

      loot = createStorage({
        type: StorageType.LootBox,
        pos: { x: 4837.678, y: -5178.569, z: 1.223 },
        inventory,
        label: "Main Dock Loot",
        meta: {
          validUntil: addMinutes(Date.now(), 10),
        },
      });

      const stopWatchingInventory = watchEffect(() => {
        if (!inventory.items.length && !isFinishing) {
          isFinishing = true;
          finish();
        }
      });

      onCleanup(() => {
        stopWatchingInventory();
      });
    });

    const onPedDeath = alt.Events.onPedDeath(({ ped }) => {
      handleEnemyDeath(ped);
    });

    const onPedDamage = alt.Events.onPedDamage(({ ped }) => {
      if (ped.streamSyncedMeta.health === 0) {
        handleEnemyDeath(ped);
      }
    });

    return () => {
      // Cleanup function
      unwatchEffect();
      onPedDeath.destroy();
      onPedDamage.destroy();
      loot?.destroy();
      areaOfInterest?.destroy();
      for (const thug of enemies) {
        thug.destroy();
      }
      enemies.clear();
    };
  },
});
