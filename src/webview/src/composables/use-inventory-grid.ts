import { usePixel } from "./use-pixel";

export const useInventoryGrid = () => {
  const px = usePixel();

  function getSlotPositionInGrid(slot: number) {
    const col = slot % 5;
    const row = Math.floor(slot / 5);

    const x = col * px(90);
    const y = row * px(90);

    return { x, y };
  }

  return { getSlotPositionInGrid };
};
