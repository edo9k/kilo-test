// Storage utilities for k8s-wordle with versioned keys
const STORAGE_KEYS = {
  STATS: 'k8s-wordle:v2:stats',
  SOLVED: 'k8s-wordle:v2:solved',
  SETTINGS: 'k8s-wordle:v2:settings'
};

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function loadStats() {
  const raw = localStorage.getItem(STORAGE_KEYS.STATS);
  return safeParse(raw) || {
    played: 0,
    won: 0,
    lost: 0,
    currentStreak: 0,
    maxStreak: 0,
    byGroup: {} // group -> { solved: Set/array, total: number }
  };
}

function saveStats(stats) {
  try {
    // Convert Sets to arrays for serialization
    const toSave = { ...stats };
    if (toSave.byGroup) {
      for (const g of Object.keys(toSave.byGroup)) {
        const bg = toSave.byGroup[g];
        if (bg.solved instanceof Set) {
          bg.solved = Array.from(bg.solved);
        }
      }
    }
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(toSave));
  } catch (e) {
    // Ignore storage errors
  }
}

function loadSolved() {
  const raw = localStorage.getItem(STORAGE_KEYS.SOLVED);
  return safeParse(raw) || {}; // word -> { solvedAt, group, meaning }
}

function saveSolved(solved) {
  try {
    localStorage.setItem(STORAGE_KEYS.SOLVED, JSON.stringify(solved));
  } catch (e) {
    // Ignore
  }
}

function loadSettings() {
  const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return safeParse(raw) || {
    wordLength: 5
  };
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    // Ignore
  }
}

function resetAllStats() {
  try {
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.SOLVED);
  } catch (e) {
    // Ignore
  }
}
