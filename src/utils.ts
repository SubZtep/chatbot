/**
 * Get random integer number between two values
 * @param max Maximum random value (... <= max)
 * @param min Minimum random value (min >= ...)
 */
export function rand(max: number, min: number = 1): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
