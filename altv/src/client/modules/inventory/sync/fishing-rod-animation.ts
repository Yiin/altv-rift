import alt from "@altv/client";
import game from "@altv/natives";
import { isItemFishingRod } from "@shared/modules/items";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { useCharacter } from "@/core/store/character.store";
import { watch } from "@yiin/reactive-proxy-state";

let isHoldingFishingRod = false;

/**
 * Animation for holding fishing rod on the shoulder.
 *
 * Commented out because it looks silly and messes with fishing scenario.
 */

// whileInGame(() => {
//   const stopWatching = watch(() => useCharacter().equipment.weapon, async (weapon) => {
//     if (weapon && !isHoldingFishingRod && isItemFishingRod(weapon)) {
//       if (!game.hasAnimDictLoaded("rcmnigel1d")) {
//         game.requestAnimDict("rcmnigel1d");
//         await alt.Utils.waitFor(() => game.hasAnimDictLoaded("rcmnigel1d"));
//       }
//       game.taskPlayAnim(alt.Player.local, "rcmnigel1d", "base_club_shoulder", 8, -8, -1, 2 | 16 | 32, 0, false, false, false);
//     } else if (!weapon && isHoldingFishingRod) {
//       game.clearPedSecondaryTask(alt.Player.local);
//       isHoldingFishingRod = false;
//     }
//   });

//   return () => {
//     stopWatching();
//   };
// });
