// Game engine - Wordle logic for k8s-wordle
const GAME_STATES = {
  IDLE: 'idle',
  IN_PROGRESS: 'in_progress',
  WON: 'won',
  LOST: 'lost'
};

// Compute feedback for a guess against answer
// Returns array of { letter, status } where status is 'correct' | 'present' | 'absent'
function computeFeedback(guess, answer) {
  if (!guess || !answer) return [];
  const guessLower = guess.toLowerCase();
  const answerLower = answer.toLowerCase();
  const feedback = Array(guessLower.length).fill().map((_, i) => ({
    letter: guessLower[i],
    status: 'absent'
  }));
  
  // Track used positions in answer
  const answerChars = answerLower.split('');
  const used = Array(answerChars.length).fill(false);
  
  // First pass: correct positions
  for (let i = 0; i < guessLower.length; i++) {
    if (i < answerChars.length && guessLower[i] === answerChars[i]) {
      feedback[i].status = 'correct';
      used[i] = true;
    }
  }
  
  // Second pass: present but in wrong position
  for (let i = 0; i < guessLower.length; i++) {
    if (feedback[i].status !== 'correct') {
      // Look for this char elsewhere in answer
      for (let j = 0; j < answerChars.length; j++) {
        if (!used[j] && guessLower[i] === answerChars[j]) {
          feedback[i].status = 'present';
          used[j] = true;
          break;
        }
      }
    }
  }
  
  return feedback;
}

// Pick a random word from WORD_BUCKETS for given length
function pickWord(length, wordBuckets) {
  if (!wordBuckets || !wordBuckets[length] || wordBuckets[length].length === 0) {
    // Fallback - try to find any word
    for (let l = 3; l <= 10; l++) {
      if (wordBuckets[l] && wordBuckets[l].length > 0) {
        length = l;
        break;
      }
    }
  }
  const words = wordBuckets[length];
  if (!words || words.length === 0) return null;
  const idx = Math.floor(Math.random() * words.length);
  return words[idx];
}

// Validate guess - must be in allowed guesses for that length and match word pattern
function validateGuess(guess, length, allowedGuesses) {
  if (!guess || typeof guess !== 'string') return false;
  const g = guess.toLowerCase();
  if (g.length !== length) return false;
  // Must be alphabetic (k8s terms are alphanumeric but mostly letters)
  if (!/^[a-z]+$/.test(g)) return false;
  if (!allowedGuesses || !allowedGuesses[length]) return false;
  // Check if in allowed guesses
  return allowedGuesses[length].includes(g);
}

// Initial game state
function initialGameState(wordLength = 5) {
  return {
    state: GAME_STATES.IDLE,
    wordLength: wordLength,
    answer: null,
    guesses: [], // array of { guess, feedback }
    currentGuess: '',
    maxGuesses: 6
  };
}

// Game reducer
function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      const answer = action.answer;
      return {
        ...state,
        state: GAME_STATES.IN_PROGRESS,
        answer: answer,
        guesses: [],
        currentGuess: ''
      };
    }
    case 'SUBMIT_GUESS': {
      if (state.state !== GAME_STATES.IN_PROGRESS || !state.answer) return state;
      const guess = action.guess.toLowerCase();
      const feedback = computeFeedback(guess, state.answer);
      const newGuesses = [...state.guesses, { guess, feedback }];
      let newState = GAME_STATES.IN_PROGRESS;
      if (guess === state.answer) {
        newState = GAME_STATES.WON;
      } else if (newGuesses.length >= state.maxGuesses) {
        newState = GAME_STATES.LOST;
      }
      return {
        ...state,
        state: newState,
        guesses: newGuesses,
        currentGuess: ''
      };
    }
    case 'SET_CURRENT_GUESS': {
      return {
        ...state,
        currentGuess: action.guess
      };
    }
    case 'RESET': {
      return initialGameState(state.wordLength);
    }
    case 'SET_WORD_LENGTH': {
      return initialGameState(action.wordLength);
    }
    default:
      return state;
  }
}
