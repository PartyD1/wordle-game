/**
 * Daily puzzle index based on UTC date.
 * Same value for everyone globally on the same calendar day (UTC).
 * Epoch: June 19, 2021 (Wordle-style).
 */
const EPOCH_UTC_MS = new Date(Date.UTC(2021, 5, 19)).getTime();
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getDayIndex(): number {
  return Math.floor((Date.now() - EPOCH_UTC_MS) / MS_PER_DAY);
}

export function getDailySolution<T>(solutions: T[]): T {
  const index = getDayIndex() % solutions.length;
  return solutions[index];
}
