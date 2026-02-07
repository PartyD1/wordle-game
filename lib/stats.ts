export const STATS_STORAGE_KEY = 'wordplay-stats';

export interface GameStats {
  gamesPlayed: number;
  wins: number;
  /** Wins by guess count: index 0 = 1 try, index 5 = 6 tries */
  winsByGuesses: [number, number, number, number, number, number];
  /** So we only count each day once */
  lastCompletedDayIndex: number | null;
}

const defaultStats: GameStats = {
  gamesPlayed: 0,
  wins: 0,
  winsByGuesses: [0, 0, 0, 0, 0, 0],
  lastCompletedDayIndex: null,
};

export function getStats(): GameStats {
  if (typeof window === 'undefined') return defaultStats;
  try {
    const raw = window.localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return defaultStats;
    const parsed = JSON.parse(raw) as Partial<GameStats>;
    return {
      gamesPlayed: typeof parsed.gamesPlayed === 'number' ? parsed.gamesPlayed : 0,
      wins: typeof parsed.wins === 'number' ? parsed.wins : 0,
      winsByGuesses: Array.isArray(parsed.winsByGuesses) && parsed.winsByGuesses.length === 6
        ? parsed.winsByGuesses as [number, number, number, number, number, number]
        : [0, 0, 0, 0, 0, 0],
      lastCompletedDayIndex: typeof parsed.lastCompletedDayIndex === 'number' ? parsed.lastCompletedDayIndex : null,
    };
  } catch {
    return defaultStats;
  }
}

export function addGameResult(dayIndex: number, won: boolean, guessCount: number): void {
  const stats = getStats();
  if (stats.lastCompletedDayIndex === dayIndex) return;
  const next: GameStats = {
    gamesPlayed: stats.gamesPlayed + 1,
    wins: stats.wins + (won ? 1 : 0),
    winsByGuesses: [...stats.winsByGuesses],
    lastCompletedDayIndex: dayIndex,
  };
  if (won && guessCount >= 1 && guessCount <= 6) {
    next.winsByGuesses[guessCount - 1] = stats.winsByGuesses[guessCount - 1] + 1;
  }
  try {
    window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}
