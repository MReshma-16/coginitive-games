// AI Service for Personalization, Dynamic Difficulty, and Memory Generation

export const aiService = {
  // Determine adaptive difficulty based on player history and current level
  calculateAdaptiveDifficulty(currentDifficulty, recentAccuracy, consecutiveSuccesses = 0) {
    let nextDifficulty = currentDifficulty;
    let itemsCount = 3;

    if (recentAccuracy >= 90 || consecutiveSuccesses >= 2) {
      // Step up difficulty gracefully
      if (currentDifficulty === 1) {
        nextDifficulty = 2;
        itemsCount = 5;
      } else if (currentDifficulty === 2) {
        nextDifficulty = 3;
        itemsCount = 7;
      } else {
        nextDifficulty = 3;
        itemsCount = 7;
      }
    } else if (recentAccuracy < 60) {
      // Gently step down difficulty to avoid frustration
      if (currentDifficulty === 3) {
        nextDifficulty = 2;
        itemsCount = 5;
      } else {
        nextDifficulty = 1;
        itemsCount = 3;
      }
    } else {
      // Keep comfortable level
      if (currentDifficulty === 1) itemsCount = 3;
      else if (currentDifficulty === 2) itemsCount = 5;
      else itemsCount = 7;
    }

    return { difficulty: nextDifficulty, itemsCount };
  },

  // Generate encouraging phrases
  getEncouragement(t) {
    const phrases = [
      t.games?.wonderful || "Wonderful!",
      t.games?.goodMemory || "Good memory!",
      t.games?.keepGoing || "You are doing great!",
      t.games?.takeYourTime || "Take your time, no rush.",
      t.games?.letsTryAnother || "Let's try another one!"
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  },

  // Generate personalized reminiscence story
  async generateDailyStory(patient) {
    try {
      const res = await fetch('/api/ai/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: patient?.name || 'Aita',
          state: patient?.state || 'Assam',
          favoriteActivity: patient?.favoriteActivities?.[0] || 'gardening',
          favoriteFood: patient?.favoriteFoods?.[0] || 'Pitha',
          favoriteSong: patient?.favoriteSongs?.[0] || 'Bihu folk tunes'
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data.story;
      }
    } catch (e) {
      console.warn('API Story fallback:', e);
    }

    // Default authentic North-East story
    return `On a bright morning in ${patient?.state || 'Assam'}, the sweet fragrance of morning tea and traditional ${patient?.favoriteFoods?.[0] || 'Pitha'} filled the sunny courtyard. ${patient?.name || 'Elder'} smiled while listening to the soft, timeless notes of old folk songs, feeling warm, peaceful, and surrounded by fond memories.`;
  },

  // Generate AI Questions for an uploaded photograph
  generatePhotoQuestions(title, category, personOrPlace) {
    return [
      {
        questionText: `Who or what do you remember most about this photograph of "${title}"?`,
        options: [
          personOrPlace || 'Family gathering',
          'A festive village celebration',
          'A quiet afternoon at home',
          'A special trip with dear ones'
        ],
        correctOption: personOrPlace || 'Family gathering',
        hint: 'Look closely at the joyful faces in the picture.'
      },
      {
        questionText: `What feeling comes to mind when you look at this lovely memory?`,
        options: [
          'Warmth and love',
          'Peaceful contentment',
          'Sweet laughter',
          'Gratitude for family'
        ],
        correctOption: 'Warmth and love',
        hint: 'Feel the gentle connection across the years.'
      }
    ];
  }
};
