// Stats utilities - overall and per-concept-group discovery stats
function getGroupForWord(word, conceptGroups) {
  if (!word) return 'unknown';
  const w = word.toLowerCase();
  for (const [group, words] of Object.entries(conceptGroups)) {
    if (words.includes(w)) {
      return group;
    }
  }
  return 'unknown';
}

function initStats() {
  return {
    played: 0,
    won: 0,
    lost: 0,
    currentStreak: 0,
    maxStreak: 0,
    byGroup: {}
  };
}

// Rebuild byGroup stats from solved map
function rebuildStatsFromSolved(solved, conceptGroups) {
  const stats = initStats();
  const solvedWords = Object.keys(solved || {});
  stats.played = solvedWords.length; // rough; but we track won/lost separately
  
  // Load existing won/lost if we have them
  const stored = localStorage.getItem('k8s-wordle:v2:stats');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      stats.won = parsed.won || 0;
      stats.lost = parsed.lost || 0;
      stats.currentStreak = parsed.currentStreak || 0;
      stats.maxStreak = parsed.maxStreak || 0;
    } catch (e) {}
  }
  
  // Initialize byGroup
  for (const group of Object.keys(conceptGroups)) {
    stats.byGroup[group] = {
      solved: new Set(),
      total: conceptGroups[group].length
    };
  }
  stats.byGroup.unknown = { solved: new Set(), total: 0 };
  
  // Count solved per group
  for (const word of solvedWords) {
    const group = getGroupForWord(word, conceptGroups);
    if (stats.byGroup[group]) {
      stats.byGroup[group].solved.add(word);
    }
  }
  
  return stats;
}

function getGroupDiscoveryStats(stats) {
  const result = [];
  if (!stats.byGroup) return result;
  for (const group of Object.keys(stats.byGroup)) {
    const bg = stats.byGroup[group];
    const solved = bg.solved instanceof Set ? bg.solved.size : (bg.solved?.length || 0);
    const total = bg.total || 0;
    const pct = total === 0 ? 0 : Math.round((solved / total) * 100);
    result.push({
      group,
      solved,
      total,
      pct,
      solvedWords: bg.solved instanceof Set ? Array.from(bg.solved) : (bg.solved || [])
    });
  }
  return result.sort((a, b) => b.pct - a.pct || a.group.localeCompare(b.group));
}
