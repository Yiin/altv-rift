type Flags = Permissions;

/**
 * Verify if a bitwise flag is enabled.
 */
export function isFlagEnabled(
  flags: Flags | number,
  flagToCheck: Flags | number
): boolean {
  const currentFlags: number = flags as number;
  const currentFlagToCheck: number = flagToCheck as number;

  if ((currentFlags & currentFlagToCheck) !== 0) {
    return true;
  }

  return false;
}
