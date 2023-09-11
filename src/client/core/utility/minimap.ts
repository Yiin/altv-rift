import alt from "@altv/client";
import game from "@altv/natives";

const Minimap = {
  /**
   * Get the width of the MiniMap
   */
  getMinimapWidth(asPercent = false): number {
    const aspectRatio = Minimap.getScreenAspectRatio();
    const resolution = Minimap.getScreenResolution();
    const result = resolution.x / (4 * aspectRatio);

    if (asPercent) {
      return Minimap.convertToPercentage(result, true);
    }

    return result;
  },

  /**
   * Get the height of the MiniMap
   */
  getMinimapHeight(asPercent = false): number {
    const resolution = Minimap.getScreenResolution();
    const result = resolution.y / 5.674;

    if (asPercent) {
      return Minimap.convertToPercentage(result, false);
    }

    return result;
  },

  /**
   * Get the Top Left of the MiniMap
   */
  getMinimapTopLeft(asPercent = false): alt.IVector2 {
    const resolution = Minimap.getScreenResolution();
    const safeZone = Minimap.getSafeZoneSize();
    const height = Minimap.getMinimapHeight();

    const x = resolution.x * ((1.0 / 20.0) * (Math.abs(safeZone - 1.0) * 10));
    const y =
      resolution.y - resolution.y * ((1.0 / 20.0) * (Math.abs(safeZone - 1.0) * 10)) - height;

    if (asPercent) {
      return {
        x: Minimap.convertToPercentage(x, true),
        y: Minimap.convertToPercentage(y, false),
      };
    }

    return { x, y };
  },

  /**
   * Get the top right of the MiniMap
   */
  getMinimapTopRight(asPercent = false): alt.IVector2 {
    const { x, y } = Minimap.getMinimapTopLeft();

    if (asPercent) {
      return {
        x: Minimap.convertToPercentage(x + Minimap.getMinimapWidth(), true),
        y: Minimap.convertToPercentage(y, false),
      };
    }

    return { x: x + Minimap.getMinimapWidth(), y };
  },

  /**
   * Get bottom left of the MiniMap
   */
  getMinimapBottomLeft(asPercent = false): alt.IVector2 {
    const { x, y } = Minimap.getMinimapTopLeft();

    if (asPercent) {
      return {
        x: Minimap.convertToPercentage(x, true),
        y: Minimap.convertToPercentage(y + Minimap.getMinimapHeight(), false),
      };
    }

    return { x, y: y + Minimap.getMinimapHeight() };
  },

  /**
   * Get Bottom Right of MiniMap
   */
  getMinimapBottomRight(asPercent = false): alt.IVector2 {
    const { x, y } = Minimap.getMinimapTopLeft();

    if (asPercent) {
      return {
        x: Minimap.convertToPercentage(x + Minimap.getMinimapWidth(), true),
        y: Minimap.convertToPercentage(y + Minimap.getMinimapHeight(), false),
      };
    }

    return {
      x: x + Minimap.getMinimapWidth(),
      y: y + Minimap.getMinimapHeight(),
    };
  },

  getSafeZoneSize(): number {
    return game.getSafeZoneSize();
  },

  getScreenAspectRatio(): number {
    return game.getAspectRatio(false);
  },

  getScreenResolution(): alt.IVector2 {
    const [_, x, y] = game.getActualScreenResolution(0, 0);
    return { x, y };
  },

  /**
   * Convert Pixel Values to Percentages
   */
  convertToPercentage(value: number, isXAxis = true): number {
    const screen = Minimap.getScreenResolution();

    if (isXAxis) {
      return value / screen.x;
    }

    return value / screen.y;
  },
};

export default Minimap;
