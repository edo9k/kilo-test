// UI rendering for k8s-wordle
let currentGameState = null;
let onKeyPressHandler = null;
let onEnterHandler = null;
let onBackspaceHandler = null;

function renderBoard(boardEl, gameState) {
  if (!boardEl) return;
  boardEl.innerHTML = '';
  const wordLength = gameState.wordLength;
  const maxGuesses = gameState.maxGuesses;
  boardEl.style.gridTemplateColumns = `repeat(${wordLength}, 1fr)`;
  
  for (let r = 0; r < maxGuesses; r++) {
    for (let c = 0; c < wordLength; c++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.setAttribute('data-row', r);
      tile.setAttribute('data-col', c);
      
      // Fill tile if guess exists
      if (r < gameState.guesses.length) {
        const guessData = gameState.guesses[r];
        const letter = guessData.guess[c] || '';
        const feedback = guessData.feedback[c] || { status: 'absent' };
        tile.textContent = letter;
        tile.classList.add('filled', feedback.status);
      } else if (r === gameState.guesses.length && gameState.currentGuess) {
        if (c < gameState.currentGuess.length) {
          tile.textContent = gameState.currentGuess[c];
          tile.classList.add('filled');
        }
      }
      boardEl.appendChild(tile);
    }
  }
}

function getKeyboardLayout(length) {
  // Base QWERTY - show - and digits conditionally? Spec says "conditionally shows - and digit keys"
  // For k8s terms we mostly have letters; show digits if needed or based on mode
  // Default layout
  return [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['enter','z','x','c','v','b','n','m','backspace']
  ];
}

function renderKeyboard(keyboardEl, gameState, keyStates = {}) {
  if (!keyboardEl) return;
  keyboardEl.innerHTML = '';
  const layout = getKeyboardLayout(gameState.wordLength);
  
  for (let row of layout) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    for (let key of row) {
      const keyBtn = document.createElement('button');
      keyBtn.className = 'key';
      if (key === 'enter' || key === 'backspace') {
        keyBtn.classList.add('key-wide');
      }
      keyBtn.textContent = key === 'backspace' ? '⌫' : key;
      keyBtn.setAttribute('data-key', key);
      
      if (keyStates[key]) {
        keyBtn.classList.add(keyStates[key]); // correct/present/absent
      }
      
      keyBtn.addEventListener('click', () => {
        if (key === 'enter' && onEnterHandler) onEnterHandler();
        else if (key === 'backspace' && onBackspaceHandler) onBackspaceHandler();
        else if (onKeyPressHandler) onKeyPressHandler(key);
      });
      
      rowDiv.appendChild(keyBtn);
    }
    keyboardEl.appendChild(rowDiv);
  }
}

function computeKeyStates(gameState) {
  const states = {};
  for (let guessData of gameState.guesses) {
    for (let i = 0; i < guessData.guess.length; i++) {
      const letter = guessData.guess[i];
      const status = guessData.feedback[i].status;
      if (!states[letter] || status === 'correct') {
        states[letter] = status;
      } else if (states[letter] === 'present' && status === 'absent') {
        // keep present
      } else if (states[letter] === 'absent' && (status === 'present' || status === 'correct')) {
        states[letter] = status;
      }
    }
  }
  return states;
}

function renderResult(resultEl, gameState, wordMeaning) {
  if (!resultEl) return;
  if (gameState.state === GAME_STATES.WON || gameState.state === GAME_STATES.LOST) {
    resultEl.style.display = 'block';
    const word = gameState.answer;
    const meaning = wordMeaning ? wordMeaning.meaning : 'Unknown';
    const link = wordMeaning ? wordMeaning.link : '#';
    resultEl.innerHTML = `
      <h2>${gameState.state === GAME_STATES.WON ? '🎉 You Won!' : '😔 Game Over'}</h2>
      <div class="result-word">${word}</div>
      <div class="result-meaning">${meaning}</div>
      <a href="${link}" target="_blank" rel="noopener noreferrer" class="result-link">${link}</a>
    `;
  } else {
    resultEl.style.display = 'none';
  }
}

function renderOverallStats(statsEl, stats) {
  if (!statsEl) return;
  const played = stats.played || 0;
  const won = stats.won || 0;
  const winRate = played === 0 ? 0 : Math.round((won / played) * 100);
  statsEl.innerHTML = `
    <div>Played: ${played}</div>
    <div>Won: ${won}</div>
    <div>Win Rate: ${winRate}%</div>
    <div>Current Streak: ${stats.currentStreak || 0}</div>
    <div>Max Streak: ${stats.maxStreak || 0}</div>
  `;
}

function renderGroupStats(groupStatsEl, stats, solvedMap) {
  if (!groupStatsEl) return;
  const groupData = getGroupDiscoveryStats(stats);
  groupStatsEl.innerHTML = '<h3 style="font-size:12px;margin-bottom:6px;">Per-Group Discovery</h3>';
  
  for (let g of groupData) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'group-row';
    const pctWidth = Math.max(8, (g.pct / 100) * 100);
    groupDiv.innerHTML = `
      <div class="group-name" title="${g.group}">${g.group}</div>
      <div class="group-bar-container">
        <div class="group-bar" style="width: ${pctWidth}%">${g.pct}%</div>
      </div>
      <div>${g.solved}/${g.total}</div>
      <button class="expand-btn" data-group="${g.group}">▼</button>
    `;
    groupStatsEl.appendChild(groupDiv);
    
    const details = document.createElement('div');
    details.className = 'group-stats-details';
    details.style.display = 'none';
    const words = g.solvedWords || [];
    details.innerHTML = `
      <div class="group-words-list">${words.length > 0 ? words.join(', ') : '(none)'}</div>
    `;
    groupStatsEl.appendChild(details);
    
    const btn = groupDiv.querySelector('.expand-btn');
    btn.addEventListener('click', () => {
      if (details.style.display === 'none') {
        details.style.display = 'block';
        btn.textContent = '▲';
      } else {
        details.style.display = 'none';
        btn.textContent = '▼';
      }
    });
  }
}
