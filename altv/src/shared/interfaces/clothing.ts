/**
 * Represents a Clothing Item / Component
 * Used to determine what to draw on a character.
 */
export interface ClothingComponent {
  /**
   * The custom name of the clothing set by the player.
   */
  name: string;

  /**
   * The combination ids to use on the component.
   * Loops through each id and applies matching drawables.
   * Must be the same length as other array items.
   */
  ids: Array<number>;

  /**
   * What the clothing item will look like.
   * It's an internal identifier.
   * Must be the same length as other array items.
   */
  drawables: Array<number>;

  /**
   * The textures that will be applied with the drawable.
   * It's an internal identifier.
   * Must be the same length as other array items.
   */
  textures: Array<number>;

  /**
   * Mark the clothing component as a prop.
   * Which uses a different set of prop identifier.
   */
  isProp: boolean;

  /**
   * What player model is this built for.
   */
  sex?: number;

  /**
   * The page which this component belongs to inside of the shop system.
   */
  internalID?: number;

  /**
   * For client-side usage. Do not set manually.
   * Calls the native and gets max drawables for an id.
   */
  maxDrawables?: Array<number>;

  /**
   * For client-side usage. Do not set manually.
   * Calls the native and gets max textures for a drawable id.
   */
  maxTextures?: Array<number>;

  /**
   * Current value that player is using.
   */
  startValue?: number;

  /**
   * The DLC Hash associated with this component.
   */
  dlcHashes?: Array<number | string>;
}
