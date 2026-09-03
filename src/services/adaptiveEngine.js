// Immediate Adaptive Difficulty & Scoring Engine for CogniCare
// Difficulty changes immediately based on the score of the completed round:
// Score < 50%   => EASY (with supportive note)
// Score 50%-79% => MEDIUM
// Score >= 80%  => HARD

export const DIFFICULTY_LEVELS = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD'
};

class AdaptiveEngine {
  constructor() {
    this.storageKey = 'cognicare_adaptive_data';
  }

  // Get data for a specific game
  getGameData(gameId) {
    try {
      const all = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      return all[gameId] || {
        currentDifficulty: DIFFICULTY_LEVELS.EASY,
        totalPlayed: 0,
        bestScore: 0,
        history: []
      };
    } catch (e) {
      return {
        currentDifficulty: DIFFICULTY_LEVELS.EASY,
        totalPlayed: 0,
        bestScore: 0,
        history: []
      };
    }
  }

  // Save updated data
  saveGameData(gameId, data) {
    try {
      const all = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      all[gameId] = data;
      localStorage.setItem(this.storageKey, JSON.stringify(all));
    } catch (e) {
      console.warn('Error saving adaptive data:', e);
    }
  }

  // Process a completed round and determine immediate adaptive level
  recordRoundResult(gameId, { correctAnswers, totalQuestions, timeTakenSeconds }) {
    const gameData = this.getGameData(gameId);
    const incorrectAnswers = Math.max(0, totalQuestions - correctAnswers);
    const percentageScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    const previousDifficulty = gameData.currentDifficulty || DIFFICULTY_LEVELS.EASY;

    let nextDifficulty = previousDifficulty;
    let isAdaptiveShift = false;
    let shiftDirection = null; // 'upgrade' | 'downgrade' | null
    let supportiveMessage = null;

    // Immediate Adaptive Progression Logic:
    // IF score < 50 => EASY
    // ELSE IF score >= 50 AND score < 80 => MEDIUM
    // ELSE IF score >= 80 => HARD
    if (percentageScore < 50) {
      nextDifficulty = DIFFICULTY_LEVELS.EASY;
      if (previousDifficulty !== DIFFICULTY_LEVELS.EASY) {
        isAdaptiveShift = true;
        shiftDirection = 'downgrade';
        supportiveMessage = "Let's try a simpler activity. Take your time! 🌿";
      } else {
        supportiveMessage = "Take your time. Practicing at a comfortable pace. 🌿";
      }
    } else if (percentageScore >= 50 && percentageScore < 80) {
      nextDifficulty = DIFFICULTY_LEVELS.MEDIUM;
      if (previousDifficulty === DIFFICULTY_LEVELS.EASY) {
        isAdaptiveShift = true;
        shiftDirection = 'upgrade';
        supportiveMessage = "Great progress! Unlocked Medium level. 🌟";
      } else if (previousDifficulty === DIFFICULTY_LEVELS.HARD) {
        isAdaptiveShift = true;
        shiftDirection = 'downgrade';
        supportiveMessage = "Let's practice at a comfortable Medium level. Take your time! 🌿";
      } else {
        supportiveMessage = "Good job! Keeping up with Medium level. 🌟";
      }
    } else if (percentageScore >= 80) {
      nextDifficulty = DIFFICULTY_LEVELS.HARD;
      if (previousDifficulty !== DIFFICULTY_LEVELS.HARD) {
        isAdaptiveShift = true;
        shiftDirection = 'upgrade';
        supportiveMessage = "Wonderful memory! Unlocked Hard level. 🏆";
      } else {
        supportiveMessage = "Mastering Hard level with wonderful memory! 🏆";
      }
    }

    gameData.currentDifficulty = nextDifficulty;
    gameData.totalPlayed = (gameData.totalPlayed || 0) + 1;
    gameData.bestScore = Math.max(gameData.bestScore || 0, percentageScore);

    const roundRecord = {
      roundNumber: gameData.totalPlayed,
      correctAnswers,
      incorrectAnswers,
      totalQuestions,
      percentageScore,
      timeTakenSeconds,
      difficulty: previousDifficulty,
      nextDifficulty,
      timestamp: new Date().toISOString()
    };

    gameData.history = [roundRecord, ...(gameData.history || []).slice(0, 29)];
    this.saveGameData(gameId, gameData);

    return {
      roundRecord,
      currentDifficulty: previousDifficulty,
      nextDifficulty,
      percentageScore,
      bestScore: gameData.bestScore,
      totalPlayed: gameData.totalPlayed,
      isAdaptiveShift,
      shiftDirection,
      supportiveMessage
    };
  }
}

export const adaptiveEngine = new AdaptiveEngine();
