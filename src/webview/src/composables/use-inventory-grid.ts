import { px } from "./use-pixel";

export const useInventoryGrid = () => {
  function getSlotPositionInGrid(slot: number) {
    const col = slot % 5;
    const row = Math.floor(slot / 5);

    const x = col * px(90);
    const y = row * px(90);

    return { x, y };
  }

  return { getSlotPositionInGrid };
};
