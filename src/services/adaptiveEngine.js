// Adaptive Difficulty & Multi-Round Scoring Engine
// Implements 3 difficulty levels (Easy, Medium, Hard) and 3-round moving average progression/downgrade

export const DIFFICULTY_LEVELS = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD'
};

class AdaptiveEngine {
  constructor() {
    this.storageKey = 'memoryroots_adaptive_data';
  }

  // Get data for a specific game
  getGameData(gameId) {
    try {
      const all = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      return all[gameId] || {
        currentDifficulty: DIFFICULTY_LEVELS.EASY,
        recentRounds: [], // stores last round scores: e.g. [80, 85, 90]
        totalPlayed: 0,
        bestScore: 0,
        history: []
      };
    } catch (e) {
      return {
        currentDifficulty: DIFFICULTY_LEVELS.EASY,
        recentRounds: [],
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

  // Process a completed round and determine adaptive level
  recordRoundResult(gameId, { correctAnswers, totalQuestions, timeTakenSeconds }) {
    const gameData = this.getGameData(gameId);
    const incorrectAnswers = Math.max(0, totalQuestions - correctAnswers);
    const percentageScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    const previousDifficulty = gameData.currentDifficulty || DIFFICULTY_LEVELS.EASY;
    const newRecentRounds = [...gameData.recentRounds, percentageScore];

    let nextDifficulty = previousDifficulty;
    let averageScore = percentageScore;
    let isAdaptiveShift = false;
    let shiftDirection = null; // 'upgrade' | 'downgrade' | null
    let supportiveMessage = null;

    // Check if player has completed at least 3 rounds at the current level
    if (newRecentRounds.length >= 3) {
      const last3 = newRecentRounds.slice(-3);
      averageScore = Math.round(last3.reduce((a, b) => a + b, 0) / 3);

      // Adaptive Progression Rule:
      // IF averageScore < 50 => EASY
      // ELSE IF averageScore >= 50 AND averageScore < 80 => MEDIUM
      // ELSE IF averageScore >= 80 => HARD
      if (averageScore < 50) {
        nextDifficulty = DIFFICULTY_LEVELS.EASY;
        if (previousDifficulty !== DIFFICULTY_LEVELS.EASY) {
          isAdaptiveShift = true;
          shiftDirection = 'downgrade';
          supportiveMessage = "Let's try a simpler activity. Take your time! 🌿";
        }
      } else if (averageScore >= 50 && averageScore < 80) {
        nextDifficulty = DIFFICULTY_LEVELS.MEDIUM;
        if (previousDifficulty === DIFFICULTY_LEVELS.EASY) {
          isAdaptiveShift = true;
          shiftDirection = 'upgrade';
          supportiveMessage = "Great progress! Moving to Medium activities. 🌟";
        } else if (previousDifficulty === DIFFICULTY_LEVELS.HARD) {
          isAdaptiveShift = true;
          shiftDirection = 'downgrade';
          supportiveMessage = "Let's practice at a comfortable Medium level. Take your time! 🌿";
        }
      } else if (averageScore >= 80) {
        nextDifficulty = DIFFICULTY_LEVELS.HARD;
        if (previousDifficulty !== DIFFICULTY_LEVELS.HARD) {
          isAdaptiveShift = true;
          shiftDirection = 'upgrade';
          supportiveMessage = "Wonderful memory! Moving to Hard activities. 🏆";
        }
      }

      // Reset recent rounds buffer after 3-round adaptation check
      gameData.recentRounds = [];
    } else {
      // Still gathering 3 rounds at current level
      gameData.recentRounds = newRecentRounds;
      averageScore = Math.round(newRecentRounds.reduce((a, b) => a + b, 0) / newRecentRounds.length);
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
      averageScore,
      timestamp: new Date().toISOString()
    };

    gameData.history = [roundRecord, ...(gameData.history || []).slice(0, 19)];
    this.saveGameData(gameId, gameData);

    return {
      roundRecord,
      currentDifficulty: previousDifficulty,
      nextDifficulty,
      averageScore,
      bestScore: gameData.bestScore,
      roundsInCurrentLevel: gameData.recentRounds.length,
      isAdaptiveShift,
      shiftDirection,
      supportiveMessage
    };
  }
}

export const adaptiveEngine = new AdaptiveEngine();
