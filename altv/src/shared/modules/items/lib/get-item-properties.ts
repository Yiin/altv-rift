import { AmmoItem, isItemKeyAmmo, isItemKeyTool, isItemKeyWeapon, ToolItem, WeaponItem } from "../registry";

/**
 * Used for admin menu shop items management.
 * E.g. when adding a new weapon, we want to display "grade" select input,
 * so we need to know all the properties that are relevant for that item.
 */
export function getItemProperties(key: string): readonly string[] {
  if (isItemKeyWeapon(key)) {
    return ['grade'] satisfies (keyof WeaponItem)[];
  }

  if (isItemKeyAmmo(key)) {
    return ['grade'] satisfies (keyof AmmoItem)[];
  }

  if (isItemKeyTool(key)) {
    return ['grade'] satisfies (keyof ToolItem)[];
  }

  return [];
}