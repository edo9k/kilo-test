// Main application logic for k8s-wordle
let gameState = initialGameState(5);
let stats = loadStats();
let solved = loadSolved();
let settings = loadSettings();

function updateStatsOnGameEnd(won, answer) {
  if (!stats.byGroup) {
    stats.byGroup = {};
    for (const group of Object.keys(CONCEPT_GROUPS)) {
      stats.byGroup[group] = { solved: new Set(), total: CONCEPT_GROUPS[group].length };
    }
    stats.byGroup.unknown = { solved: new Set(), total: 0 };
  }
  
  if (won) {
    stats.won = (stats.won || 0) + 1;
    stats.currentStreak = (stats.currentStreak || 0) + 1;
    if (stats.currentStreak > (stats.maxStreak || 0)) {
      stats.maxStreak = stats.currentStreak;
    }
    // Mark as solved
    const group = getGroupForWord(answer, CONCEPT_GROUPS);
    solved[answer] = {
      solvedAt: Date.now(),
      group: group,
      meaning: WORD_MEANINGS[answer] ? WORD_MEANINGS[answer].meaning : ''
    };
    saveSolved(solved);
    // Update byGroup
    if (stats.byGroup[group]) {
      stats.byGroup[group].solved.add(answer);
    }
  } else {
    stats.lost = (stats.lost || 0) + 1;
    stats.currentStreak = 0;
  }
  stats.played = (stats.played || 0) + 1;
  saveStats(stats);
}

function startNewGame() {
  const length = parseInt(document.getElementById('wordLength').value) || 5;
  settings.wordLength = length;
  saveSettings(settings);
  gameState = initialGameState(length);
  const answer = pickWord(length, WORD_BUCKETS);
  if (!answer) {
    alert('No words available for this length');
    return;
  }
  gameState = gameReducer(gameState, { type: 'START_GAME', answer });
  renderAll();
}

function renderAll() {
  renderBoard(document.getElementById('board'), gameState);
  const keyStates = computeKeyStates(gameState);
  renderKeyboard(document.getElementById('keyboard'), gameState, keyStates);
  const wordMeaning = WORD_MEANINGS[gameState.answer];
  renderResult(document.getElementById('result'), gameState, wordMeaning);
  renderOverallStats(document.getElementById('overallStats'), stats);
  renderGroupStats(document.getElementById('groupStats'), stats, solved);
}

function handleKeyPress(key) {
  if (gameState.state !== GAME_STATES.IN_PROGRESS) return;
  if (gameState.currentGuess.length < gameState.wordLength) {
    gameState = gameReducer(gameState, {
      type: 'SET_CURRENT_GUESS',
      guess: gameState.currentGuess + key
    });
    renderAll();
  }
}

function handleBackspace() {
  if (gameState.state !== GAME_STATES.IN_PROGRESS) return;
  gameState = gameReducer(gameState, {
    type: 'SET_CURRENT_GUESS',
    guess: gameState.currentGuess.slice(0, -1)
  });
  renderAll();
}

function handleEnter() {
  if (gameState.state !== GAME_STATES.IN_PROGRESS) return;
  if (gameState.currentGuess.length !== gameState.wordLength) return;
  // Validate guess
  if (!validateGuess(gameState.currentGuess, gameState.wordLength, ALLOWED_GUESSES)) {
    alert('Not a valid word');
    return;
  }
  gameState = gameReducer(gameState, {
    type: 'SUBMIT_GUESS',
    guess: gameState.currentGuess
  });
  // Check if game ended
  if (gameState.state === GAME_STATES.WON || gameState.state === GAME_STATES.LOST) {
    updateStatsOnGameEnd(gameState.state === GAME_STATES.WON, gameState.answer);
  }
  renderAll();
}

function resetStatsWithConfirm() {
  if (confirm('Reset all stats? This cannot be undone.')) {
    resetAllStats();
    stats = loadStats();
    solved = loadSolved();
    renderAll();
  }
}

// Set up UI handlers
onKeyPressHandler = handleKeyPress;
onEnterHandler = handleEnter;
onBackspaceHandler = handleBackspace;

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const newGameBtn = document.getElementById('newGameBtn');
  const resetStatsBtn = document.getElementById('resetStatsBtn');
  const wordLengthSel = document.getElementById('wordLength');
  
  if (newGameBtn) newGameBtn.addEventListener('click', startNewGame);
  if (resetStatsBtn) resetStatsBtn.addEventListener('click', resetStatsWithConfirm);
  if (wordLengthSel) {
    wordLengthSel.value = settings.wordLength || 5;
  }
  
  // Keyboard event listener for physical keyboard
  document.addEventListener('keydown', (e) => {
    if (gameState.state !== GAME_STATES.IN_PROGRESS) return;
    const key = e.key.toLowerCase();
    if (key.length === 1 && /[a-z0-9]/.test(key)) {
      handleKeyPress(key);
    } else if (key === 'enter') {
      handleEnter();
    } else if (key === 'backspace' || key === 'delete') {
      handleBackspace();
    }
  });
  
  // Initialize stats structure
  if (!stats.byGroup) {
    stats = rebuildStatsFromSolved(solved, CONCEPT_GROUPS);
    saveStats(stats);
  }
  
  // Start initial game
  startNewGame();
});
