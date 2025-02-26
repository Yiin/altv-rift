/**
 * Calculates the experience required to reach a specific level using the formula:
 * xp(L) = ⌊(1/4) * Σ(n=1 to L-1) ⌊n + 300 × 2^(n/7)⌋⌋
 *
 * @param level The level to calculate experience for
 * @returns The total experience required to reach this level
 */
export function calculateRequiredXP(level: number): number {
  if (level <= 1) return 0;

  let sum = 0;

  // Sum from n=1 to L-1
  for (let n = 1; n < level; n++) {
    // Calculate inner floor: ⌊n + 300 × 2^(n/7)⌋
    const innerValue = Math.floor(n + 300 * Math.pow(2, n / 7));
    sum += innerValue;
  }

  // Calculate outer floor: ⌊(1/4) * sum⌋
  return Math.floor(sum / 4);
}

/**
 * Gets the current level based on the player's experience points
 */
export function getLevel(xp: number): number {
  let level = 1;

  // Keep increasing level until we find where the XP requirement exceeds the player's XP
  while (calculateRequiredXP(level + 1) <= xp) {
    level++;
  }

  return level;
}

/**
 * Gets the experience points needed to reach the next level
 */
export function getMissingExperience(xp: number): number {
  const currentLevel = getLevel(xp);
  const nextLevelXP = calculateRequiredXP(currentLevel + 1);
  return nextLevelXP - xp;
}

/**
 * Gets the progress percentage towards the next level (0-100)
 */
export function getLevelProgress(xp: number): number {
  const currentLevel = getLevel(xp);
  const currentLevelXP = calculateRequiredXP(currentLevel);
  const nextLevelXP = calculateRequiredXP(currentLevel + 1);

  if (currentLevel >= 200) {
    // Assuming max level is 200, adjust as needed
    return 100;
  }

  return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
}

/**
 * Checks if a level up has occurred between two XP values
 */
export function isLevelUp(previousXP: number, currentXP: number): boolean {
  return getLevel(previousXP) < getLevel(currentXP);
}
